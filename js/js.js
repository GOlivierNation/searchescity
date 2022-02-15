//selector
const select = selectors => {
    return document.querySelector(selectors);
  };
  
  //declaration
  let search = select("#search");
  let result_containner = select(".result-list");
  let defaultDiv = select(".container-empty");
  let modalback = select(".modal-container");
  let modal = select(".modal");
  let result_p = select(".result-p");
  let count = 0;
  
  //number format
  const numberFormat = number => {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };
  
  //style for growth
  const style_growth = val => {
    return val[0] == "0" || val[0] == "-"
      ? '<b class="text-red">' + val + "<b>"
      : '<b class="text-green">' + val + "<b>";
  };
  
  // filter
  const filterText = value => {
    let res = value.replace(/ +/g, " "); // remove all the spaces
    res = res.toLowerCase();
    return res;
  };
  
  // for search data
  const search_data = (value, key) => {
    value = filterText(value);
    key = filterText(key);
    return value.search(key) == 0 ? true : false;
  };
  
  // highlite
  const colorLise = (str, key) => {
    str = filterText(str);
    key = filterText(key);
    let newS = str.replace(key, "<span class='highlited'>" + key + "</span>");
    return newS;
  };
  
  // close or Open Modal
  
  const displayModal = () => {
    modalback.classList.toggle("hidden");
    modal.classList.toggle("hidden");
  }
  
  select(".modal-close").addEventListener("click", () => {displayModal()});
  modalback.addEventListener("click", () => {displayModal()});
  
  
  
  //desplay data fro modal
  const display_content_modal = (type, val) => {
    if (type == "population") {
      return numberFormat(val);
    } else if (type == "growth_from_2000_to_2013") {
      return style_growth(val);
    } else {
      return val;
    }
  };
  
  // on key up
  search.onkeyup = () => {
    count = 0;
    result_containner.innerHTML = `
      <div class="no-data">
          <h1> Loading... </h1>
      </div>
      `;
  
    defaultDiv.style.display = "none";
  
    if (search.value !== "") {
      fetch(
        "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
      )
        .then(response => {
          return response.json();
        })
        .then(myJson => {
          result_containner.innerHTML = "";
  
          for (const key in myJson) {
            const result = myJson[key];
  
            if (
              search_data(result.city, search.value) ||
              search_data(result.state, search.value)
            ) {
              count++;
  
              result_containner.innerHTML += `
                  <div class="result-item" onclick="modalDiv(${result.rank})">
                  <h2>${colorLise(result.city, search.value)}</h2>
                  <section>
                      <label>State:</label>
                      <b>${colorLise(result.state, search.value)}</b>
                  </section>
                  <section>
                      <label>Population:</label> <b>${numberFormat(
                        result.population
                      )}</b>
                  </section>
                  <section>
                      <label>growth from 2000 to 2013:</label> <b>${numberFormat(
                        style_growth(result.growth_from_2000_to_2013)
                      )}</b>
                  </section>
              </div>
  
              `;
            }
          }
          result_p.innerHTML = `<b>${count}</b> Results found.`;
  
          if (count == 0) {
            result_containner.innerHTML = `
                <div class="no-data">
                
                <p>Your search - <b>${
                  search.value
                }</b> - did not match any City or State.</p>
  
                <br>
                Suggestions:
                <br>
                <ul class="list-nodata">
                <li> Make sure that all words are spelled correctly.</li>
                
                <li>Try different keywords.</li>
                <li>Try more general keywords.</li>
                <li>Try fewer keywords.</li>
                </ul>
                </div>
                `;
          }
        });
  
      defaultDiv.style.display = "none";
    } else {
      result_p.innerHTML = "";
      defaultDiv.style.display = "block";
      result_containner.innerHTML = "";
    }
  };
  
  // modal
  const modalDiv = Rank => {
    fetch(
      "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
    )
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        for (const key in myJson) {
          const result = myJson[key];
  
          if (result.rank == Rank) {
            select(".title-modal span").innerHTML = "";
            select(".title-modal span").innerHTML = result.city;
            displayModal();
            select(".modal-contents").innerHTML = "";
            // load contents
            for (const item in result) {
              select(".modal-contents").innerHTML += `
                  <label>${item.replace(/_+/g, " ")}</label>
                  <h3>${display_content_modal(item, result[item])}</h3>
                  ${item == 'state' ? "" : '<hr />'}
               `;
            }
          }
        }
      });
  };
  