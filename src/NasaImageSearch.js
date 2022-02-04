import { html, css, LitElement } from 'lit';
import '@lrnwebcomponents/accent-card';

export class NasaImageSearch extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--nasa-image-search-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      searchTerm: { type: String, reflect: true },
      images: { type: Array },
    };
  }

  constructor() {
    super();
    this.images = [];
    this.searchTerm = '';
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'searchTerm' && this[propName]) {
        this.getData();
      } else if (propName === 'images') {
        this.render();
      } else if (propName === 'images') {
        this.dispatchEvent(
          new CustomEvent('results-changed', {
            detail: {
              value: this.images,
            },
          })
        );
      }
    });
  }

  getData() {
    const apiURL = 'https://images-api.nasa.gov/search?media_type=image&q=';
    fetch(apiURL + this.searchTerm)
      .then(response => response.json())
      .then(data => {
        this.images = [];
        const imageCollection = new Array(data.collection.items);
        for (let i = 0; i < imageCollection[0].length; i += 1) {
          this.images.push(imageCollection[0][i]);
        }
      });
  }

  updateSearchTerm() {
    this.searchTerm = this.shadowRoot.querySelector('#searchTerm').value;
  }

  render() {
    return html`
      <h2>NASA Search</h2>
      <input type="text" id="searchTerm"></input>
      <button @click=${this.updateSearchTerm}>Search!</button>
      <br><br>
      ${this.images.map(
        item => html`
          <accent-card
            image-src=${item.links[0].href}
            accent-color="green"
            horizontal
            style="max-width:80%;"
          >
            <div slot="heading">${item.data[0].title}</div>
            <div slot="content">${item.data[0].description}</div>
          </accent-card>
        `
      )}
    `;
  }
}
