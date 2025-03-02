import { computed, onUnmounted, readonly, watch } from 'vue'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import Mirador from 'mirador'
import MiradorApp from 'mirador/dist/es/src/components/App'
import createPluggableStore from 'mirador/dist/es/src/state/createPluggableStore'

export default function useMirador (container, manifest) {
  const _windowId = 'document'

  const config = computed(() => {
    return {
      id: container.value.id,
      windows: [
        {
          id: _windowId,
          loadedManifest: manifest.value.id,
          canvasId: manifest.value.items[0].id
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
  const instance = {
    manifestUrl: readonly(manifest.value?.id),
    initialize,
    setCanvasId,
    dispatchAction,
    config: readonly(config),
    reactRoot: null,
    miradorStore: null
  }
  function initialize () {
    console.log('mirador init')
    instance.reactRoot = ReactDOM.createRoot(container.value)
    console.log('mirador initialize config.value', config.value)
    instance.miradorStore = createPluggableStore(config.value)
    instance.reactRoot.render(
      React.createElement(
        Provider,
        { store: instance.miradorStore },
        React.createElement(
          MiradorApp,
          { plugins: [] }
        )
      )
    )
  }

  const isReady = computed(() => manifest.value !== null && container.value !== null)

  watch(isReady, (isReady, wasReady) => {
    if (isReady && !wasReady) {
      initialize()
    }
  })
  onUnmounted(() => {
    if (instance.reactRoot !== null) {
      console.log('mirador unmount in onUnmounted')
      instance.reactRoot.unmount()
    }
  })

  function dispatchAction (action) {
    if (instance.miradorStore !== null) {
      instance.miradorStore.dispatch(action)
    }
  }

  function setCanvasId (canvasId) {
    console.log('setCanvasId', canvasId)
    const action = Mirador.actions.setCanvas(_windowId, canvasId)
    dispatchAction(action)
  }
  console.log('mirador instance', instance)
  return instance
}
