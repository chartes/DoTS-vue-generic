import { computed, readonly, ref } from 'vue'
import Mirador from 'mirador'

export default function useMirador (containerId = 'vue-mirador-container', _manifestUrl, _canvasIndex = 0) {
  const _windowId = 'document'
  let mirador = null

  const manifestUrl = ref(_manifestUrl)

  const config = computed(() => {
    return {
      id: containerId,
      windows: [
        {
          id: _windowId,
          loadedManifest: manifestUrl.value,
          canvasIndex: _canvasIndex
        }
      ],
      window: {
        allowClose: false,
        allowMaximize: false,
        defaultSideBarPanel: 'info',
        sideBarOpenByDefault: false,
        hideWindowTitle: true,
        maximizedByDefault: true
      },
      selectedTheme: 'light',
      themes: {
        light: {
          palette: {
            type: 'light',
            primary: {
              main: '#971716'
            },
            secondary: {
              main: '#B9192F'
            }
          }
        }
      },
      workspace: {
        showZoomControls: true,
        type: 'mosaic' // Which workspace type to load by default. Other possible values are "elastic"
      },
      workspaceControlPanel: {
        enabled: false
      }
    }
  })

  const initialize = function () {
    console.log('mirador init')
    mirador = Mirador.viewer(config.value)
  }

  const dispatchAction = function (action) {
    if (mirador === null) {
      initialize()
    }
    mirador.store.dispatch(action)
  }

  const setManifestUrl = function (newUrl) {
    console.log('setManifestUrl', newUrl)
    manifestUrl.value = newUrl
    const action = Mirador.actions.updateWindow(_windowId, {
      manifestId: manifestUrl.value
    })
    dispatchAction(action)
  }

  const setCanvasId = function (canvasId) {
    console.log('setCanvasId', canvasId)
    const action = Mirador.actions.setCanvas(_windowId, canvasId)
    dispatchAction(action)
  }

  return {
    manifestUrl: readonly(manifestUrl),
    initialize,
    setManifestUrl,
    setCanvasId,
    dispatchAction,
    config: readonly(config)
  }
}
