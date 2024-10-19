$(document).ready(function() {
  fetchCategories();
});

function fetchCategories() {
  axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(response => {
          const categories = response.data.categories;
          let categoriesHTML = '';
          categories.forEach(category => {
              categoriesHTML += `
                  <div class="col-lg-3 col-md-4 col-6">
                      <div class="card mb-4 shadow-sm" data-category="${category.strCategory}">
                          <img src="${category.strCategoryThumb}" class="card-img-top" alt="${category.strCategory}">
                          <div class="card-body">
                              <h5 class="card-title">${category.strCategory}</h5>
                          </div>
                      </div>
                  </div>
              `;
          });
          $('#categories').html(categoriesHTML);
          $('.card').click(function() {
              const category = $(this).data('category');
              window.location.href = `category.html?category=${category}`;
          });
      })
      .catch(error => console.log(error));
}

$(document).ready(function() {
  const params = new URLSearchParams(window.location.search);
  const categoryName = params.get('category');
  if (categoryName) {
    $('#category-name').text(categoryName);
    fetchCategoryDetails(categoryName);
  }
});

function fetchCategoryDetails(categoryName) {
  axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
    .then(response => {
      const meals = response.data.meals;
      let mealsHTML = '';
      meals.forEach(meal => {
        mealsHTML += `
          <div class="col-lg-3 col-md-4 col-6">
            <div class="card mb-4 shadow-sm" data-meal-id="${meal.idMeal}">
              <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
              <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
              </div>
            </div>
          </div>
        `;
      });
      $('#category-details').html(mealsHTML);
      $('.card').click(function() {
        const mealId = $(this).data('meal-id');
        window.location.href = `meal.html?mealId=${mealId}`;
      });
    })
    .catch(error => console.log(error));
}

$(document).ready(function() {
  const params = new URLSearchParams(window.location.search);
  const mealId = params.get('mealId');
  if (mealId) {
    fetchMealDetails(mealId);
  }
});

function fetchMealDetails(mealId) {
  axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => {
      const meal = response.data.meals[0];
      let mealHTML = `
        <div class="col-12">
          <div class="meal-card mb-4 shadow-sm">
            <div class="row">
              <div class="col-md-6">
                <img src="${meal.strMealThumb}" class="meal-card-img-top" alt="${meal.strMeal}">
              </div>
              <div class="col-md-6">
                <div class="meal-card-body">
                  <h1 class="meal-card-title">${meal.strMeal}</h1>
                  <h2 class="meal-card-subtitle mb-2 text-muted">${meal.strArea} Culinary</h2>
                  <h5>Instructions</h5>
                  <p class="meal-card-text">${meal.strInstructions}</p>
                  <h5>Recipe</h5>
                  <ul>
      `;
      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          mealHTML += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
      }
      mealHTML += `
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 text-center mt-4">
          <h5 class="tutorial">Tutorial</h5>
          <iframe class="centered-iframe" width="560" height="315" src="https://www.youtube.com/embed/${meal.strYoutube.split('=')[1]}" frameborder="0" allowfullscreen></iframe>
        </div>
      `;
      $('#meal-details').html(mealHTML);
      $('#meal-title').text(meal.strMeal);
    })
    .catch(error => console.log(error));
}