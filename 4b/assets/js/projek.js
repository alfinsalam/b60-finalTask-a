document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const previewContainer = document.querySelector(".container-prview");
  const noDataMessage = document.getElementById("no-data-message");
  const bgPreview = document.querySelector(".bg-preview");
  let editingIndex = null;

  function displayProjects() {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];

    if (projects.length === 0) {
      noDataMessage.style.display = "block";
    } else {
      noDataMessage.style.display = "none";
    }

    previewContainer.innerHTML = "";
    projects.forEach((project, index) => {
      const card = document.createElement("div");
      card.classList.add("card-preview");

      const cardImage = document.createElement("div");
      cardImage.classList.add("card-image");
      const imgElement = document.createElement("img");
      imgElement.classList.add("card-img");
      imgElement.src = project.image;
      imgElement.alt = "Project Image";
      cardImage.appendChild(imgElement);

      const cardContent = document.createElement("div");
      cardContent.classList.add("card-content");

      const cardTitle = document.createElement("h2");
      cardTitle.classList.add("card-title");
      cardTitle.textContent = project.title;

      const dateRange = document.createElement("div");
      dateRange.classList.add("date-range");
      dateRange.textContent = `Start Date: ${project.start}, End Date: ${project.end}`;

      const cardDescription = document.createElement("p");
      cardDescription.classList.add("card-description");
      cardDescription.textContent = project.description;

      const cardCategories = document.createElement("div");
      cardCategories.classList.add("card-categories");
      cardCategories.textContent = project.categories.join(", ");

      const cardActions = document.createElement("div");
      cardActions.classList.add("card-actions");

      const editButton = document.createElement("button");
      editButton.classList.add("edit-btn");
      editButton.textContent = "Edit";
      editButton.onclick = () => editProject(index);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-btn");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => deleteProject(index);

      cardActions.appendChild(editButton);
      cardActions.appendChild(deleteButton);

      cardContent.appendChild(cardTitle);
      cardContent.appendChild(dateRange);
      cardContent.appendChild(cardDescription);
      cardContent.appendChild(cardCategories);
      cardContent.appendChild(cardActions);
      card.appendChild(cardImage);
      card.appendChild(cardContent);

      previewContainer.appendChild(card);
    });
  }

  function deleteProject(index) {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.splice(index, 1);
    localStorage.setItem("projects", JSON.stringify(projects));
    displayProjects();
  }

  function editProject(index) {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const project = projects[index];

    document.querySelector("#title").value = project.title;
    document.querySelector("#start").value = project.start;
    document.querySelector("#end").value = project.end;
    document.querySelector("#description").value = project.description;

    project.categories.forEach((category) => {
      const checkbox = document.querySelector(`input[value="${category}"]`);
      if (checkbox) checkbox.checked = true;
    });

    editingIndex = index;
    window.scrollTo(0, 0);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get("title");
    const start = formData.get("start");
    const end = formData.get("end");
    const description = formData.get("description");
    const categories = [];
    formData
      .getAll("category")
      .forEach((category) => categories.push(category));
    const image = formData.get("image");

    const reader = new FileReader();
    reader.onloadend = function () {
      const project = {
        title,
        start,
        end,
        description,
        categories,
        image: reader.result,
      };

      const projects = JSON.parse(localStorage.getItem("projects")) || [];

      if (editingIndex !== null) {
        projects[editingIndex] = project;
        editingIndex = null;
      } else {
        projects.push(project);
      }

      localStorage.setItem("projects", JSON.stringify(projects));

      form.reset();
      displayProjects();

      bgPreview.scrollIntoView({ behavior: "smooth" });
    };

    if (image) {
      reader.readAsDataURL(image);
    }
  });

  displayProjects();
});
