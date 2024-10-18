export class Card {
  constructor(id, title, body, isChecked = false) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.isChecked = isChecked;
  }

  toHTML() {
    return `
        <div class="card ${this.isChecked ? "checked" : ""}" id="card-${
      this.id
    }">
            <h3 class="title">${this.title}</h3>
            <p>${this.body}</p>

            <input type="checkbox" id="check-${
              this.id
            }" class="control check" ${this.isChecked ? "checked" : ""}>
        </div>
    `;
  }
}

class SearchField {
  constructor(value = "") {
    this.value = value;
  }

  toHTML() {
    return `
            <input type="text" value="${this.value}" class="control">
        `;
  }

  changeValue(event) {
    this.value = event.target.value;
  }
}

export class Content {
  constructor(selector, callback) {
    this.$el = document.querySelector(selector);
    this.callback = callback;
  }

  render(model) {
    this.$el.innerHTML = "";
    model.forEach((block) => {
      new CardElement("#content", block, this.callback);
    });
    const darkCount = this.$el.querySelectorAll(".checked").length;
    this.$el.insertAdjacentHTML(
      "beforeend",
      `<p>Количество выделенных карточек: ${darkCount}`
    );
  }
}

class CardElement {
  constructor(selector, card, callback) {
    this.$el = document.querySelector(selector);
    this.card = card;
    this.callback = callback;

    this.init();
  }

  init() {
    this.$el.insertAdjacentHTML("beforeend", this.card.toHTML());

    const check = this.$el.querySelector(`#check-${this.card.id}`);

    check.addEventListener("change", (ev) => {
      console.log(ev);
      this.callback(this.card.id, ev.target.checked);
    });
  }
}

export class SearchBar {
  constructor(selector, callback) {
    this.$el = document.querySelector(selector);
    this.input = new SearchField(new URL(window.location.href).searchParams.get("title") || '');
    this.searchCallback = callback

    this.init();
  }

  init() {
    this.$el.insertAdjacentHTML("beforeend", this.input.toHTML());
    this.$el.insertAdjacentHTML(
      "beforeend",
      `<button id="search-btn" class="btn">Найти</button>
      <button id="clear-btn" class="btn">Очистить локальное хранилище</button>
      `
    );
    const refInput = this.$el.querySelector("input.control");
    const refBtn = this.$el.querySelector("#search-btn");
    const refClear = this.$el.querySelector("#clear-btn");
    refInput.addEventListener("input", this.input.changeValue.bind(this.input));
    refBtn.addEventListener("click", this.search.bind(this));
    refClear.addEventListener("click", this.clear.bind(this));
  }

  search() {
    const url = new URL(window.location.href);
    console.log(url.searchParams.has("title"));
        url.searchParams.has("title")
      ? url.searchParams.set("title", this.input.value)
      : url.searchParams.append("title", this.input.value);
    window.location.href=url.toString();
  }

  clear() {
    localStorage.clear();
  }
}
