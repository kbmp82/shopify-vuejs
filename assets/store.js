const store = Vuex.createStore({
  state() {
    return {
      cart: {
        items: [],
      },
      miniCartOpen: false
    };
  },
  mutations: {
    //state, payload
    SET_CART(state, cart) {
      //update price formatting
      cart.items_subtotal_price = `$${(cart.total_price / 100).toFixed(2)}`;
      cart.items.forEach((item) => {
        item.price = `$${(item.price / 100).toFixed(2)}`;
        item.final_line_price = `$${(item.final_line_price / 100).toFixed(2)}`;
      });
      state.cart = cart;
    },
    SET_MINI_CART(state, miniCartOpen){
        state.miniCartOpen = miniCartOpen;
    }
  },
  actions: {
    getCart({ commit }) {
      return fetch("/cart.js", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          commit("SET_CART", json);
        });
    },
    updateCart({ commit, state }, index) {
      const id = state.cart.items[index].variant_id;
      const qty = parseInt(state.cart.items[index].quantity);

      let data = {
        updates: {
          [id]: qty,
        },
      };

      return fetch("/cart/update.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((cart) => commit("SET_CART", cart));
    },
    removeCartItem({ commit, state }, index) {
      const id = state.cart.items[index].variant_id;

      let data = {
        updates: {
          [id]: 0,
        },
      };

      fetch("/cart/update.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((cart) => commit("SET_CART", cart));
    },
    addItemToCart({ commit, dispatch }, payload) {
      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(() => {
          dispatch("getCart");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeMiniCart({commit}){
        commit("SET_MINI_CART", false);
    },
    openMiniCart({commit}){
        commit("SET_MINI_CART", true);
    }
  },
  getters: {
    cart: (state) => {
      return state.cart;
    },
    cartTotal: (state) => {
        let total = 0;

        state.cart.items.forEach(item =>{
            total += parseInt(item.quantity)
        })

        return total;
    },
    miniCart: (state) => {
        return state.miniCartOpen;
    }
  },
});
