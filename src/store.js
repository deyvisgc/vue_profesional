import Vue from 'vue';
import firebase from "firebase";
import Vuex from 'vuex';
// import sourceData from './data.json'
import countProperties from './util'
Vue.use(Vuex);

export default new Vuex.Store({
  state: { // me creo estados para que se puedan utilizar globalmente
    // ...sourceData,
    // user: null,
    services: {},
    rooms: {},
    users: {},
    authId: null,
    modals: {
      login: false,
    },
    modalsCreate: {
      register: false,
    },

  },
  mutations: { // mutuacion es quiena actualiza el valor
    SET_MODAL_STATE: (state, { name, value }) => {
      state.modals[name] = value;
    },
    SET_MODAL_CREATE_STATE: (state, { name, value }) => {
      state.modalsCreate[name] = value;
    },
    SET_ROOM(state, { newRoom, RoomId }) {
      Vue.set(state.rooms, RoomId, newRoom) // el metodo set recibe 3 parametros, primero el objeto a modificar, luego el id generado para asignar , por ultimo el objeto a guardar
    },
    SET_APPEND_ROOM_TO_USER(state, { roomId, userId }) { // agrego las relaciones el rommid al objeto rooms del objeto users
      Vue.set(state.users[userId].rooms, roomId, roomId )
    },
    SET_ITEMS(state, { item, id, resource }) {
      const newItems = item
      newItems['.key'] = id
      Vue.set(state[resource], id, newItems)
    },
    SET_ITEMS_SERVICES(state, { item, resource, id }) {
      Vue.set(state[resource], id, item)
    },
    SET_AUTH_ID(state, id) { // seteo el autId con el valor ingresado
      state.authId = id
    }
  },
  actions: { // se define las acciones que se va hacer en este caso se va abrir y oculta.
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value });
    },
    TOGGLE_MODAL_CREATE_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_CREATE_STATE', { name, value });
    },
    CREATE_ROOMS: ({ state, commit }, romms) => { // en vuex no se puede agregar mas datos a un array o objeto
      // const newRoom = romms // agregar mi objeto a rooms para poder cambiar la informacion y agregar los idRooms
      // const RoomId = `room${Math.random()}`;
      // newRoom['.key'] = RoomId; // agrego el valor .key y le agrego el id
      // newRoom.userId = state.authId; // obtengo el id autoenticado
      const newRoom = romms
      const roomId = firebase.database().ref('rooms').push().key;
      newRoom.userId = state.authId
      newRoom.publishedAt = Math.floor(Date.now() / 1000); // obtengo la fecha actual de la publicacion
      newRoom.meta = { like: 0 };
      const map = new Map();
      map.set(romms.services.id, romms.services.id)
      newRoom.services = map.get(romms.services.id)
      const updates = {}
      updates[`rooms/${roomId}`] = newRoom // primer genera una nueva publicacion 
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId // luego actualiza la mutacion creada el valor del usuario
      firebase.database().ref().update(updates).then(() => {
        commit('SET_ROOM', { newRoom, roomId }); // lanso las mutaciones para crear el room y agregar las keys
        commit('SET_APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId })
        return Promise.resolve(state.rooms[roomId]);
      })
    },
    CREATE_USERS: ({ state, commit }, { email, password, userName }) => new Promise(resolve => {
      // aqui inserto en firebase autoentication, esto solo puede guardar el email y la contraseña no datos personales
      firebase.auth().createUserWithEmailAndPassword(email, password).then((acount) => {
        const id = acount.user.uid; // aqui obtengo el id del usuario creado
        const registerAt = Math.floor(Date.now() / 1000)
        const newUser = { email, userName, registerAt}
        firebase.database().ref('users').child(id).set(newUser).then(() => { // aqui inserto a la base de datos del firebase
          commit('SET_ITEMS', { item: newUser, id, resource: 'users' }) // aqui le agrego a mi objeto users en el state
          resolve(state.users[id]) // devuelvo el usuario creado
        })
      })
    }),
    FETCH_ROOMS: ({ state, commit }, limit) => new Promise(resolve => {
      let instance = firebase.database().ref('rooms');
      if (limit) {
        instance = instance.limitToFirst(limit) // aqui obtengo solo la cantidad que mando en el limit
      }
      instance.once('value', (snapshot) => { // esto es para generar el query para obtener la data
        const rooms = snapshot.val()
        Object.keys(rooms).forEach((rommID) => {
          const room = rooms[rommID]
          commit('SET_ITEMS', {item: room, id:rommID, resource: 'rooms'})
        })
        resolve(Object.values(state.rooms))
      })
    }),
    FETCH_SERVICES: ({ state, commit }, limit) => new Promise(resolve => {
      let instance = firebase.database().ref('services');
      if (limit) {
        instance = instance.limitToFirst(limit)
      }
      instance.once('value', (snapshot) => {
        const services = snapshot.val()
        Object.keys(services).forEach((serviceId) => {
          const service = services[serviceId]
          service.id = serviceId
        commit('SET_ITEMS_SERVICES', { item: service, resource: 'services', id: serviceId })
      })
      })
      resolve(Object.values(state.services))
    }),
    FETCH_USERS: ({ state, commit }, id) => new Promise(resolve => {
      firebase.database().ref('users').child(id).once('value', (snapshot) => {
        const users = snapshot.val()
        commit('SET_ITEMS', { item: users, id: snapshot.key, resource: 'users' })
        resolve(Object.values(state.users[id])) // devuelvo los users por su id 
      })
    }),
    FETCH_AUTH_USER: ({ dispatch, commit }) => {
      const userID = firebase.auth().currentUser.uid // obtengo el usuario autoenticado
      return dispatch('FETCH_USERS', userID).then(() => { // obtengo la informacion del usuario autoenticado
        commit('SET_AUTH_ID', userID) // seteo el authId con el id del usuario autoenticado
      });
    },
    // contexr hace referencia a state, dispatcher, commit , pero cuando no se va usar se declara asi
    SIGN_IN: (context, { email, password }) => { // hago la consulta para inicias sesion,
      return firebase.auth().signInWithEmailAndPassword(email, password);
    },
    LOG_OUT: ({ commit }) => {  // Cierro sesion y llaml al setear authId
      firebase.auth().signOut().then(() => {
        commit('SET_AUTH_ID', null)
      });
    }
  },
  getters: { // su funciones es obtener datos del state y returnar a las vistas o componentes
    modals: state => state.modals,
    modalscreate: state => state.modalsCreate,
    authUsers: state => (state.authId) ? state.users[state.authId] : null, // aqui obtengo la informacion del usuario autoenticado y le envio a la vista
    romms: state => state.rooms,
    services: state => state.services,
    usersCountRomms: state => id => countProperties(state.users[id].rooms) // aqui hago el conteo de habitaciones.
  },
});
