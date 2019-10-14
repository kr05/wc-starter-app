/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';

// PWA helpers
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// These are the elements needed by this element.
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-drawer';
import './components/snack-bar.js';

class MyApp extends LitElement {
  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-drawer-width: 256px;

          --app-primary-color: #0068e8;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-transparent-white: rgba(360, 360, 360, 0.1);

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-background-color: var(--app-transparent-white);
          --app-drawer-selected-color: #83b5ff;
        }

        mwc-top-app-bar {
          --mdc-theme-primary: var(--app-header-background-color);
          --mdc-theme-on-primary: var(--app-header-text-color);
        }

        mwc-icon-button > svg {
          fill: black;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .drawer-content {
          padding: 0px 16px 0 16px;
          height: 100%;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
        }

        .drawer-list {
          margin-top: 12px;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
          background-color: var(--app-drawer-selected-background-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          min-height: 100vh;
          padding: 12px;
        }

        /* Title slots do not inherit global font-family property. Manually set. */
        [slot='title'] {
          font-family: 'Roboto Slab', sans-serif;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        .menu-btn {
          display: block;
        }

        .title-container {
          min-height: 64px;
          box-sizing: border-box;
          padding: 0px 0 4px;
          width: 100%;

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
        }

        .title-container > .title {
          font-size: 20px;
          margin-bottom: -20px;
        }

        @media (max-width: 600px) {
          .title-container {
            min-height: 56px;
          }
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 480px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }
        }
      `,
    ];
  }

  render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Drawer content -->
      <mwc-drawer type="modal">
        <div class="drawer-content">
          <div class="title-container">
            <h3 class="title">${this.appTitle}</h3>
          </div>
          <div class="drawer-list">
            <a ?selected="${this._page === 'view1'}" href="/view1">View One</a>
            <a ?selected="${this._page === 'view2'}" href="/view2">View Two</a>
          </div>
        </div>

        <div slot="appContent">
          <!-- Header -->
          <mwc-top-app-bar @MDCTopAppBar:nav="${this._updateDrawerStateEvent}" class="toolbar-top">
            <mwc-icon-button class="menu-btn" title="Menu" slot="navigationIcon">
              <svg slot="icon" height="24" viewBox="0 0 24 24" width="24" fill="none">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
              </svg>
            </mwc-icon-button>
            <div slot="title">${this.appTitle}</div>
            <nav slot="actionItems" class="toolbar-list">
              <a ?selected="${this._page === 'view1'}" href="/view1">View One</a>
              <a ?selected="${this._page === 'view2'}" href="/view2">View Two</a>
            </nav>
          </mwc-top-app-bar>

          <!-- Main content -->
          <main role="main" class="main-content">
            <my-view1 class="page" ?active="${this._page === 'view1'}"></my-view1>
            <my-view2 class="page" ?active="${this._page === 'view2'}"></my-view2>
            <error-view class="page" ?active="${this._page === 'view404'}"></error-view>
          </main>

          <snack-bar ?active="${this._snackbarOpened}">
            You are now ${this._offline ? 'offline' : 'online'}.
          </snack-bar>
        </div>
      </mwc-drawer>
    `;
  }

  constructor() {
    super();
    this._drawerOpened = false;
  }

  firstUpdated() {
    installRouter(location => this._locationChanged(location));
    installOfflineWatcher(offline => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 480px)`, matches => this._layoutChanged(matches));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = `${this.appTitle} - ${this._page}`;
      updateMetadata({
        title: pageTitle,
        description: pageTitle,
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  _layoutChanged(isWideLayout) {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._setDrawerState(false);
  }

  _offlineChanged(offline) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }

    clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = true;
    this.__snackbarTimer = setTimeout(() => {
      this._snackbarOpened = false;
    }, 3000);
  }

  _locationChanged(location) {
    const path = window.decodeURIComponent(location.pathname);
    const page = path === '/' ? 'view1' : path.slice(1);
    this._loadPage(page);
    // Any other info you might want to extract from the path (like page type),
    // you can do here.

    // Close the drawer - in case the *path* change came from a link in the drawer.
    this._setDrawerState(false);
  }

  _updateDrawerStateEvent() {
    this._toggleDrawerState();
  }

  _toggleDrawerState() {
    const drawer = this.shadowRoot.querySelector('mwc-drawer');
    drawer.open = !drawer.open;
  }

  _setDrawerState(state) {
    const drawer = this.shadowRoot.querySelector('mwc-drawer');
    if (drawer.open !== state) drawer.open = state;
  }

  _loadPage(page) {
    switch (page) {
      case 'view1':
        import('./views/my-view1/my-view1.js');
        break;
      case 'view2':
        import('./views/my-view2/my-view2.js');
        break;
      default:
        // eslint-disable-next-line no-param-reassign
        page = 'view404';
        import('./views/error-view/error-view.js');
    }

    this._page = page;
  }
}

window.customElements.define('my-app', MyApp);
