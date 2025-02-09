async function generateItinerary() {
    const location = document.getElementById("search").value;
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    const budget = parseFloat(document.getElementById("budget").value);
    const currency = document.getElementById("currency").value;

    if (!location || !startDate || !endDate || isNaN(budget) || budget <= 0) {
        alert("Please enter valid travel details.");
        return;
    }

    if (startDate > endDate) {
        alert("End date must be after the start date.");
        return;
    }

    document.getElementById("loading").style.display = "block";

    try {
        const { lat, lon } = await getCoordinates(location); // Get coordinates
        console.log(`Coordinates for ${location}: Lat = ${lat}, Lon = ${lon}`);

        const attractions = await fetchAttractions(location, lat, lon);
        console.log("Attractions:", attractions); // Log the attractions

        if (attractions.length === 0) {
            alert("No attractions found for the specified location.");
            document.getElementById("loading").style.display = "none";
            return;
        }

        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        let itineraryHtml = `<h4>Your Daily Plan:</h4><ul>`;
        let dailyBudget = budget / totalDays;

        for (let i = 0; i < totalDays; i++) {
            const attraction = attractions[i % attractions.length]; // Cycle through attractions
            const weather = await fetchWeather(location);
            console.log(`Day ${i + 1}: Weather = ${weather}`); // Log weather data

            itineraryHtml += `<li>Day ${i + 1}: Visit <strong>${attraction}</strong> (Weather: ${weather}, Estimated Cost: ${currency} ${(dailyBudget * 0.8).toFixed(2)})</li>`;
        }

        itineraryHtml += `</ul><p><strong>Total Budget:</strong> ${currency} ${budget.toFixed(2)}</p>`;
        document.getElementById("itinerary").innerHTML = itineraryHtml;
    } catch (error) {
        console.error("Error generating itinerary:", error);
        alert("There was an error generating the itinerary.");
    }

    document.getElementById("loading").style.display = "none";
}
