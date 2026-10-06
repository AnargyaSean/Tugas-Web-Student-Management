const initialStudents = [
  { nim: "231001", name: "Naufal Hidayat", major: "Informatika", email: "naufal@mail.com" },
  { nim: "231002", name: "Alya Puspitasari", major: "Sistem Informasi", email: "alya@mail.com" },
  { nim: "231003", name: "Galih Wicaksono", major: "Teknik Komputer", email: "galih@mail.com" },
  { nim: "231004", name: "Citra Maharani", major: "Manajemen", email: "citra@mail.com" },
  { nim: "231005", name: "Bagas Wijaya", major: "Informatika", email: "bagas@mail.com" },
  { nim: "231006", name: "Nadia Oktaviani", major: "Sistem Informasi", email: "nadia@mail.com" },
  { nim: "231007", name: "Ilham Kurniawan", major: "Teknik Komputer", email: "ilham@mail.com" },
  { nim: "231008", name: "Vina Amelia", major: "Manajemen", email: "vina@mail.com" },
  { nim: "231009", name: "Raka Prabowo", major: "Informatika", email: "raka@mail.com" },
  { nim: "231010", name: "Laras Wulandari", major: "Sistem Informasi", email: "laras@mail.com" },
  { nim: "231011", name: "Farhan Akbar", major: "Teknik Komputer", email: "farhan@mail.com" },
  { nim: "231012", name: "Dinda Aprilia", major: "Manajemen", email: "dinda@mail.com" },
  { nim: "231013", name: "Reza Maulana", major: "Informatika", email: "reza@mail.com" },
  { nim: "231014", name: "Tiara Fitriani", major: "Sistem Informasi", email: "tiara@mail.com" },
  { nim: "231015", name: "Aditiya Nugroho", major: "Teknik Komputer", email: "aditiya@mail.com" }
];

const pageSize = 5;
const form = document.querySelector("#student-form");
const list = document.querySelector("#student-list");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-input");
const pagination = document.querySelector("#pagination");
const countLabel = document.querySelector("#active-count");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
let students = [...initialStudents];
let currentPage = 1;
let editingNim = null;

function createIcon(path) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  shape.setAttribute("d", path);
  svg.append(shape);
  return svg;
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.append(value instanceof Node ? value : document.createTextNode(value));
  return cell;
}

function createButton(label, className, iconPath, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", label);
  button.title = label;
  if (iconPath) button.append(createIcon(iconPath));
  button.addEventListener("click", onClick);
  return button;
}

function getFilteredStudents() {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  return students.filter((student) =>
    [student.nim, student.name, student.major, student.email]
      .some((value) => value.toLocaleLowerCase("id").includes(query))
  );
}

function renderStudents() {
  const filtered = getFilteredStudents();
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  currentPage = Math.min(currentPage, pageCount);
  const start = (currentPage - 1) * pageSize;

  list.replaceChildren();
  filtered.slice(start, start + pageSize).forEach((student, index) => {
    const major = document.createElement("span");
    const actions = document.createElement("span");
    const row = document.createElement("tr");
    major.className = `major-tag ${student.major.toLocaleLowerCase("id").replaceAll(" ", "-")}`;
    major.textContent = student.major;
    actions.className = "row-actions";
    actions.append(
      createButton("Edit " + student.name, "icon-button edit-button", "M16 4l4 4L9 19l-5 1 1-5L16 4Zm-2 2 4 4", () => editStudent(student.nim)),
      createButton("Hapus " + student.name, "icon-button delete-button", "M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6", () => deleteStudent(student.nim))
    );
    row.append(...[
      String(start + index + 1), student.nim, student.name, major, student.email, actions
    ].map(createCell));
    list.append(row);
  });
  emptyState.hidden = filtered.length > 0;
  countLabel.textContent = `${students.length} Mahasiswa Aktif`;
  renderPagination(pageCount);
}

function createPageButton(label, page, iconPath, disabled) {
  const button = createButton(label, "page-button", iconPath, () => changePage(page));
  button.disabled = disabled;
  if (!iconPath) {
    button.textContent = String(page);
    if (page === currentPage) {
      button.classList.add("current");
      button.setAttribute("aria-current", "page");
    }
  }
  return button;
}

function renderPagination(pageCount) {
  pagination.replaceChildren(
    createPageButton("Halaman sebelumnya", currentPage - 1, "m15 18-6-6 6-6", currentPage === 1),
    ...Array.from({ length: pageCount }, (_, i) =>
      createPageButton(`Halaman ${i + 1}`, i + 1, null, false)
    ),
    createPageButton("Halaman berikutnya", currentPage + 1, "m9 18 6-6-6-6", currentPage === pageCount)
  );
}

function changePage(page) {
  currentPage = page;
  renderStudents();
}

function resetForm() {
  form.reset();
  editingNim = null;
  submitButton.querySelector("span").textContent = "Simpan";
}

function editStudent(nim) {
  const student = students.find((item) => item.nim === nim);
  if (!student) return;
  editingNim = nim;
  Object.entries(student).forEach(([key, value]) => { form.elements[key].value = value; });
  submitButton.querySelector("span").textContent = "Perbarui";
  form.elements.name.focus();
}

function deleteStudent(nim) {
  students = students.filter((student) => student.nim !== nim);
  if (editingNim === nim) resetForm();
  renderStudents();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const student = {
    nim: form.elements.nim.value.trim(),
    name: form.elements.name.value.trim(),
    major: form.elements.major.value,
    email: form.elements.email.value.trim()
  };
  if (students.some((item) => item.nim === student.nim && item.nim !== editingNim)) {
    const nimInput = form.elements.nim;
    nimInput.setCustomValidity("NIM sudah terdaftar.");
    nimInput.reportValidity();
    nimInput.addEventListener("input", () => nimInput.setCustomValidity(""), { once: true });
    return;
  }
  if (editingNim) {
    students = students.map((item) => item.nim === editingNim ? student : item);
  } else {
    students.push(student);
    currentPage = Math.ceil(getFilteredStudents().length / pageSize) || 1;
  }
  resetForm();
  renderStudents();
});

form.addEventListener("reset", () => {
  editingNim = null;
  submitButton.querySelector("span").textContent = "Simpan";
});
cancelButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderStudents();
});
renderStudents();
