const API_KEY = "your_openweathermap_api_key"; // Replace with a real API key

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("destination").addEventListener("change", updateTheme);
});

// Theme & Backgrounds Based on Destination
function updateTheme() {
    const city = document.getElementById("destination").value;
    const body = document.body;
    const header = document.querySelector("header");

    const cityThemes = {
        "Paris": {
            background: "url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyaXN8ZW58MHx8MHx8fDA%3D')",
            color: "#ffb6c1"
        },
        "New York": {
            background: "url('https://fullsuitcase.com/wp-content/uploads/2022/05/One-day-in-New-York-USA-NYC-day-trip-itinerary.jpg')",
            color: "#95dae4"
        },
        "Tokyo": {
            background: "url('https://source.unsplash.com/1600x900/?tokyo,shibuya')",
            color: "#ff5733"
        },
        "London": {
            background: "url('https://source.unsplash.com/1600x900/?london,bridge')",
            color: "#4169e1"
        },
        "Rome": {
            background: "url('https://source.unsplash.com/1600x900/?rome,colosseum')",
            color: "#8b0000"
        },
        "Sydney": {
            background: "url('https://source.unsplash.com/1600x900/?sydney,opera')",
            color: "#00bfff"
        },
        "Dubai": {
            background: "url('https://source.unsplash.com/1600x900/?dubai,burj')",
            color: "#daa520"
        }
    };

    if (cityThemes[city]) {
        body.style.backgroundImage = cityThemes[city].background;
        body.style.backgroundSize = "cover";
        body.style.backgroundPosition = "center";
        body.style.backgroundAttachment = "fixed";
        header.style.backgroundColor = cityThemes[city].color;
    }
}

// Itinerary Data
const destinationData = {
    "Paris": {
        activities: [
            { name: "Eiffel Tower Visit", cost: 30 },
            { name: "Louvre Museum", cost: 20 },
            { name: "Seine River Cruise", cost: 50 }
        ],
        accommodations: [
            { name: "Budget Hotel", costPerNight: 100 },
            { name: "Mid-range Hotel", costPerNight: 200 },
            { name: "Luxury Hotel", costPerNight: 400 }
        ],
        food: ["Croissants 🥐", "Escargots", "Coq au Vin"]
    },
    "New York": {
        activities: [
            { name: "Statue of Liberty", cost: 25 },
            { name: "Central Park", cost: 0 },
            { name: "Broadway Show", cost: 100 }
        ],
        accommodations: [
            { name: "Budget Hostel", costPerNight: 50 },
            { name: "Mid-range Hotel", costPerNight: 150 },
            { name: "Luxury Hotel", costPerNight: 350 }
        ],
        food: ["Bagels 🥯", "Cheesecake 🍰", "Hot Dogs 🌭"]
    }
};

// Generate Itinerary
function generateItinerary() {
    const selectedDestination = document.getElementById('destination').value;
    const budget = parseFloat(document.getElementById('budget').value);
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!selectedDestination || isNaN(budget) || budget <= 0 || !startDate || !endDate) {
        alert("Please enter all details correctly.");
        return;
    }

    const data = destinationData[selectedDestination];
    if (!data) {
        alert("Sorry, no data for this destination.");
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let activities = data.activities.filter(activity => activity.cost <= budget);
    let accommodations = data.accommodations.filter(acc => acc.costPerNight <= budget / 3);
    let foodOptions = data.food || [];

    let itinerarySummary = `
        <h3>Destination: ${selectedDestination}</h3>
        <h4>Dates: ${startDate} to ${endDate} (Total Days: ${days})</h4>
        <h4>Activities:</h4>
        <ul>${activities.map(activity => `<li>${activity.name} - $${activity.cost}</li>`).join('')}</ul>
        <h4>Accommodation Options:</h4>
        <ul>${accommodations.map(acc => `<li>${acc.name} - $${acc.costPerNight} per night</li>`).join('')}</ul>
        <h4>Must-Try Foods 🍽:</h4>
        <ul>${foodOptions.map(food => `<li>${food}</li>`).join('')}</ul>
    `;

    document.getElementById('itinerary-summary').innerHTML = itinerarySummary;

    // Fetch Weather Data
    fetchWeather(selectedDestination);
}

// Fetch Weather and Update UI
function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            let weatherSummary = `
                <h4>🌤 Weather Forecast:</h4>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
            `;
            document.getElementById('itinerary-summary').innerHTML += weatherSummary;
        })
        .catch(error => console.log("Error fetching weather:", error));
}
