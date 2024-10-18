import { Card, Content, SearchBar } from "./components/components";

export class App {
  constructor(model = []) {
    this.model = model;
  }

  get filteredModel() {
    let searchReq = new URL(window.location.href).searchParams.get("title");
    if (!searchReq) searchReq = '';
    return this.model.filter((el) => {
        return el.title.toLowerCase().includes(searchReq.toLowerCase());
    })
  }

  init() {
    fetchData().then((res) => {
      res.forEach((el) =>
        this.model.push(new Card(el.id, el.title, el.body, el.isChecked))
      );
      const handleCheck = (id, value) => {
        this.model[id - 1].isChecked = value;
        content.render(this.filteredModel);

        localStorage.setItem("local-test", JSON.stringify(this.model));
      };
      const search = new SearchBar("#search");

      const content = new Content("#content", handleCheck);
      content.render(this.filteredModel);
    });
  }
}

async function fetchData() {
  let data = localStorage.getItem("local-test");
  if (data) return JSON.parse(data);
  try {
    const responce = await fetch(
      "https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7"
    );
    data = await responce.json();
    return data;
  } catch (e) {
    console.log(e);
  }
  return {};
}
