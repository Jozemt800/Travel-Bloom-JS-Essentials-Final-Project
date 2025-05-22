document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const btnReset = document.getElementById('btnReset');
    const resultDiv = document.getElementById('result');

   
    function resetBtn() {
        document.getElementById('locationInput').value = '';
        resultDiv.innerHTML = '';
        locationInput.focus(); 
    }

    // Search Function
    function searchLocation() {
        const input = document.getElementById('locationInput').value.trim().toLowerCase();
        resultDiv.innerHTML = '';

        if (!input) {
            resultDiv.innerHTML = '<div class="no-location"> <h2 id="local-time-text">please enter a location</h2></div>';
            return;
        }

        fetch('./travel_bloom_api.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const allLocations = [
                    ...data.countries.flatMap(country => country.cities),
                    ...data.temples,
                    ...data.beaches
                ];

                const searchTerms = input.split(/[, ]+/).filter(Boolean);
                const matches = allLocations.filter(location => 
                    searchTerms.every(term => 
                        location.name.toLowerCase().includes(term)
                    )
                );

                if (matches.length) {
                    const htmlString = matches.map(location => `
                        <div class="location-card">
                            <img class="location-img" src="${location.imageUrl}" 
                                 alt="${location.name}">
                            <h2 class="location-title">${location.name}</h2>
                            <p class="location-desc">${location.description}</p>
                            <button class="visitBtn">Visit</button>
                        </div>
                    `).join('');
                    resultDiv.innerHTML = htmlString;
                } else {
                    resultDiv.innerHTML = `
                        <div class="no-results-found">
                            No locations found for "${document.getElementById('locationInput').value}"
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                resultDiv.innerHTML = `
                    <div class="error">
                        Failed to load recommendations. Please try again later.
                    </div>
                `;
            });
    }

    // Event listeners
    btnReset.addEventListener("click", resetBtn);
    btnSearch.addEventListener('click', searchLocation);

    // Add enter key support
    document.getElementById('locationInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchLocation();
    });
});


