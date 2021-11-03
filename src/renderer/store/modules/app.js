
const app = {
  state: {
    sidebar: {
      opened: !+localStorage.getItem('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    isdownload:false, 
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        localStorage.setItem('sidebarStatus', 1)
      } else {
        localStorage.setItem('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      localStorage.setItem('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    DOWNLOAD_STATE:(state,isdownload) =>{
      state.isdownload = isdownload
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar ({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    //下载状态
    downloadState :({commit},isdownload) =>{
      commit('DOWNLOAD_STATE',isdownload)
    }
  }
}

export default app
