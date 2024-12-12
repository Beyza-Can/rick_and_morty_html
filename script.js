const API_URL = "https://rickandmortyapi.com/api/character";
let characters = [];
let filteredCharacters = [];
let currentPage = 1;
let pageSize = 5;
let sortOrder = "asc";

// Fetch data from API
async function fetchData() {
  try {
    let data = [];
    let nextUrl = API_URL;
    while (nextUrl) {
      const response = await fetch(nextUrl);
      const result = await response.json();
      data = data.concat(result.results);
      nextUrl = result.info.next;
    }
    characters = data;
    filteredCharacters = [...characters];
    renderTable();
  } catch (error) {
    console.error("API Fetch Error:", error);
  }
}

// Render the table
function renderTable() {
  const tbody = document.getElementById("characterTable");
  const pageInfo = document.getElementById("pageInfo");
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;

  tbody.innerHTML = "";
  const currentCharacters = filteredCharacters.slice(startIdx, endIdx);

  if (currentCharacters.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11">No characters match your filters.</td></tr>`;
    pageInfo.textContent = `Page ${currentPage} of 0`;
    return;
  }

  currentCharacters.forEach((char) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${char.id}</td>
      <td>${char.name}</td>
      <td>${char.status}</td>
      <td>${char.species}</td>
      <td>${char.type || "N/A"}</td>
      <td>${char.gender}</td>
      <td>${char.origin.name}</td>
      <td>${char.location.name}</td>
      <td>${char.episode.length}</td>
      <td><img src="${char.image}" alt="${char.name}" width="50"></td>
      <td>${new Date(char.created).toLocaleDateString()}</td>
    `;
    row.addEventListener("click", () => renderCharacterDetail(char));
    tbody.appendChild(row);
  });

  pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredCharacters.length / pageSize)}`;
}

// Render character detail
function renderCharacterDetail(char) {
  const detailDiv = document.getElementById("characterDetail");
  detailDiv.innerHTML = `
    <h2>${char.name}</h2>
    <img src="${char.image}" alt="${char.name}" style="width:150px;">
    <p>Status: ${char.status}</p>
    <p>Species: ${char.species}</p>
    <p>Type: ${char.type || "N/A"}</p>
    <p>Gender: ${char.gender}</p>
    <p>Origin: ${char.origin.name}</p>
    <p>Location: ${char.location.name}</p>
    <p>Episodes: ${char.episode.length}</p>
    <p>Created At: ${new Date(char.created).toLocaleDateString()}</p>
  `;
}

// Apply filters
function filterData() {
  const nameFilter = document.getElementById("nameFilter").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;
  const speciesFilter = document.getElementById("speciesFilter").value;

  filteredCharacters = characters.filter((char) => {
    return (
      (nameFilter ? char.name.toLowerCase().includes(nameFilter) : true) &&
      (statusFilter ? char.status.toLowerCase() === statusFilter.toLowerCase() : true) &&
      (speciesFilter ? char.species === speciesFilter : true)
    );
  });

  currentPage = 1;
  renderTable();
}

// Change page
function changePage(direction) {
  const totalPages = Math.ceil(filteredCharacters.length / pageSize);
  if (direction === "prev" && currentPage > 1) {
    currentPage--;
  } else if (direction === "next" && currentPage < totalPages) {
    currentPage++;
  }
  renderTable();
}

// Sort data
function sortData() {
  const sortCriteria = document.getElementById("sortCriteria").value;
  filteredCharacters.sort((a, b) => {
    const aValue = a[sortCriteria] || "";
    const bValue = b[sortCriteria] || "";
    return sortOrder === "asc"
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });
  renderTable();
}

// Toggle sort order
function toggleSortOrder() {
  sortOrder = sortOrder === "asc" ? "desc" : "asc";
  document.getElementById("sortOrderButton").textContent = sortOrder === "asc" ? "Artan" : "Azalan";
  sortData();
}

// Event listeners
document.getElementById("applyFilters").addEventListener("click", filterData);
document.getElementById("prevPage").addEventListener("click", () => changePage("prev"));
document.getElementById("nextPage").addEventListener("click", () => changePage("next"));
document.getElementById("sortCriteria").addEventListener("change", sortData);
document.getElementById("sortOrderButton").addEventListener("click", toggleSortOrder);
document.getElementById("pageSize").addEventListener("change", (e) => {
  pageSize = parseInt(e.target.value, 10);
  currentPage = 1;
  renderTable();
});

// Initial fetch
fetchData();
