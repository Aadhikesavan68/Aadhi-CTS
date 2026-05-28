console.log("Welcome to the Community Portal");

window.addEventListener("load", () => {
    alert("The Community Portal is fully loaded.");
});

class CommunityEvent {
    constructor({
        id,
        name,
        date,
        category,
        location,
        seatsAvailable,
        capacity = seatsAvailable,
        description = ""
    }) {
        this.id = id || `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        this.name = name;
        this.date = date;
        this.category = category;
        this.location = location;
        this.seatsAvailable = seatsAvailable;
        this.capacity = capacity;
        this.description = description;
    }

    isUpcoming(referenceDate = new Date()) {
        return new Date(this.date) >= new Date(referenceDate.toDateString());
    }
}

CommunityEvent.prototype.checkAvailability = function checkAvailability() {
    return this.seatsAvailable > 0;
};

const featuredEventName = "Neighborhood Music Jam";
const featuredEventDate = "2026-06-18";
let featuredSeats = 25;

const seedEvents = [
    {
        id: "workshop-01",
        name: "Workshop on Baking",
        date: "2026-06-05",
        category: "Workshop",
        location: "Community Hall",
        seatsAvailable: 18,
        description: "Hands-on baking session for families and food lovers."
    },
    {
        id: "music-01",
        name: "Music in the Park",
        date: "2026-06-12",
        category: "Music",
        location: "Central Park",
        seatsAvailable: 12,
        description: "An evening concert featuring local bands and choirs."
    },
    {
        id: "sports-01",
        name: "Neighborhood Sports Day",
        date: "2026-05-22",
        category: "Sports",
        location: "River Stadium",
        seatsAvailable: 0,
        description: "A past event kept for history, but hidden from the live list."
    },
    {
        id: "community-01",
        name: "Green Market Meetup",
        date: "2026-06-20",
        category: "Community",
        location: "Market Square",
        seatsAvailable: 40,
        description: "Meet local vendors, crafters, and community organizers."
    }
];

const remoteMockEvents = [
    {
        id: "remote-01",
        name: "Tech for Teens",
        date: "2026-06-24",
        category: "Technology",
        location: "Innovation Lab",
        seatsAvailable: 16,
        description: "A beginner-friendly coding and hardware workshop."
    },
    {
        id: "remote-02",
        name: "Yoga at Sunrise",
        date: "2026-06-26",
        category: "Wellness",
        location: "Lakeside",
        seatsAvailable: 22,
        description: "Morning stretching and breath-work for all levels."
    }
];

function createCategoryRegistrationTracker() {
    const totals = {};

    return (category) => {
        totals[category] = (totals[category] || 0) + 1;
        return totals[category];
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        featuredEvent: document.querySelector("#featuredEvent"),
        statusMessage: document.querySelector("#statusMessage"),
        eventList: document.querySelector("#eventList"),
        categoryFilter: document.querySelector("#categoryFilter"),
        locationFilter: document.querySelector("#locationFilter"),
        searchInput: document.querySelector("#searchInput"),
        clearFiltersBtn: document.querySelector("#clearFiltersBtn"),
        loadingSpinner: document.querySelector("#loadingSpinner"),
        remoteStatus: document.querySelector("#remoteStatus"),
        registrationForm: document.querySelector("#registrationForm"),
        eventSelect: document.querySelector("#eventSelect"),
        formMessage: document.querySelector("#formMessage"),
        fullNameError: document.querySelector("#fullNameError"),
        emailError: document.querySelector("#emailError"),
        eventSelectError: document.querySelector("#eventSelectError"),
        loadMockBtn: document.querySelector("#loadMockBtn"),
        loadAsyncBtn: document.querySelector("#loadAsyncBtn"),
        simulateCancelBtn: document.querySelector("#simulateCancelBtn")
    };

    const events = seedEvents.map((event) => new CommunityEvent(event));
    const categoryTracker = createCategoryRegistrationTracker();
    const registrationsByEventId = {};
    const filterState = {
        category: "all",
        location: "all",
        search: ""
    };

    elements.featuredEvent.textContent = `${featuredEventName} is scheduled for ${featuredEventDate} with ${featuredSeats} seats reserved for the next spotlight session.`;

    function setMessage(message, target = elements.statusMessage) {
        target.textContent = message;
    }

    function getFilterState() {
        return { ...filterState };
    }

    function isVisibleEvent(event, filters) {
        const searchTerm = filters.search.toLowerCase();
        const matchesCategory = filters.category === "all" || event.category === filters.category;
        const matchesLocation = filters.location === "all" || event.location === filters.location;
        const matchesSearch = event.name.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesLocation && matchesSearch && event.isUpcoming() && event.checkAvailability();
    }

    function filterEventsByCategory(category = "all", callback = () => true) {
        const clonedEvents = [...events];
        return clonedEvents.filter((event) => (category === "all" || event.category === category) && callback(event));
    }

    function populateFilters() {
        const categories = [...new Set(events.map((event) => event.category))];
        const locations = [...new Set(events.map((event) => event.location))];

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            elements.categoryFilter.append(option);
        });

        locations.forEach((location) => {
            const option = document.createElement("option");
            option.value = location;
            option.textContent = location;
            elements.locationFilter.append(option);
        });
    }

    function populateEventSelect() {
        elements.eventSelect.innerHTML = "";

        filterEventsByCategory("all", (event) => event.isUpcoming() && event.checkAvailability()).forEach((event) => {
            const option = document.createElement("option");
            option.value = event.id;
            option.textContent = `${event.name} - ${event.location}`;
            elements.eventSelect.append(option);
        });
    }

    function renderEventCard(event) {
        const card = document.createElement("article");
        card.className = "eventCard";
        card.dataset.eventId = event.id;

        const title = document.createElement("span");
        title.className = "eventTag";
        title.textContent = event.category;

        const heading = document.createElement("h3");
        heading.textContent = event.name;

        const summary = document.createElement("p");
        summary.textContent = `${event.date} · ${event.location}`;

        const description = document.createElement("p");
        description.textContent = event.description;

        const infoList = document.createElement("dl");
        Object.entries(event).forEach(([key, value]) => {
            if (key === "capacity" || key === "description") {
                return;
            }

            const label = document.createElement("dt");
            label.textContent = key;

            const data = document.createElement("dd");
            data.textContent = String(value);

            infoList.append(label, data);
        });

        const actions = document.createElement("div");
        actions.className = "eventActions";

        const registerButton = document.createElement("button");
        registerButton.type = "button";
        registerButton.textContent = "Register";
        registerButton.onclick = () => {
            try {
                registerUser(event.id, { source: "card" });
            } catch (error) {
                setMessage(error.message);
            }
        };

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.textContent = "Cancel";
        cancelButton.onclick = () => {
            try {
                cancelRegistration(event.id);
            } catch (error) {
                setMessage(error.message);
            }
        };

        actions.append(registerButton, cancelButton);
        card.append(title, heading, summary, description, infoList, actions);
        return card;
    }

    function renderEvents(sourceEvents = events, filters = getFilterState()) {
        const clonedEvents = [...sourceEvents];
        const visibleEvents = clonedEvents.filter((event) => isVisibleEvent(event, filters));

        elements.eventList.innerHTML = "";

        if (visibleEvents.length === 0) {
            const emptyState = document.createElement("p");
            emptyState.className = "subtleNote";
            emptyState.textContent = "No upcoming events match the current filters.";
            elements.eventList.append(emptyState);
            populateEventSelect();
            return;
        }

        visibleEvents.forEach((event) => {
            const card = renderEventCard(event);
            elements.eventList.append(card);
        });

        populateEventSelect();
        if (window.jQuery) {
            window.jQuery(".eventCard").stop(true, true).fadeOut(80).fadeIn(180);
        }
    }

    function updateFilterState(partialState) {
        Object.assign(filterState, partialState);
        renderEvents();
    }

    function addEvent(eventData = {}) {
        const {
            name = "Neighborhood Story Circle",
            date = "2026-06-30",
            category = "Community",
            location = "Town Hall",
            seatsAvailable = 20,
            description = "A new community event added from the portal."
        } = eventData;

        const newEvent = new CommunityEvent({
            name,
            date,
            category,
            location,
            seatsAvailable,
            capacity: seatsAvailable,
            description
        });

        events.push(newEvent);
        renderEvents();
        return newEvent;
    }

    function registerUser(eventId, formData = {}) {
        const event = events.find((item) => item.id === eventId);

        if (!event) {
            throw new Error("Event not found.");
        }

        if (!event.checkAvailability()) {
            throw new Error("This event is full.");
        }

        let remainingSeats = event.seatsAvailable;
        remainingSeats--;
        event.seatsAvailable = remainingSeats;

        registrationsByEventId[eventId] = (registrationsByEventId[eventId] || 0) + 1;
        const categoryTotal = categoryTracker(event.category);
        const attendeeName = formData.name || "Guest";

        setMessage(`${attendeeName} registered for ${event.name}. Seats left: ${event.seatsAvailable}. ${event.category} registrations tracked: ${categoryTotal}.`);
        renderEvents();
        return event;
    }

    function cancelRegistration(eventId) {
        const event = events.find((item) => item.id === eventId);

        if (!event) {
            throw new Error("Event not found.");
        }

        if (!registrationsByEventId[eventId]) {
            throw new Error("No active registration to cancel.");
        }

        event.seatsAvailable = Math.min(event.capacity, event.seatsAvailable + 1);
        registrationsByEventId[eventId] -= 1;
        setMessage(`Registration cancelled for ${event.name}. Seats restored to ${event.seatsAvailable}.`);
        renderEvents();
    }

    function validateRegistrationFields(formElements) {
        const errors = {
            fullName: "",
            email: "",
            eventSelect: ""
        };

        if (!formElements.fullName.value.trim()) {
            errors.fullName = "Name is required.";
        }

        if (!formElements.email.value.trim() || !formElements.email.value.includes("@")) {
            errors.email = "A valid email address is required.";
        }

        if (!formElements.eventSelect.value) {
            errors.eventSelect = "Choose an event before registering.";
        }

        elements.fullNameError.textContent = errors.fullName;
        elements.emailError.textContent = errors.email;
        elements.eventSelectError.textContent = errors.eventSelect;

        return !Object.values(errors).some(Boolean);
    }

    function getMockEndpoint() {
        return `data:application/json,${encodeURIComponent(JSON.stringify(remoteMockEvents))}`;
    }

    function loadMockEventsWithThenCatch() {
        elements.loadingSpinner.hidden = false;
        setMessage("Loading mock events using then/catch...", elements.remoteStatus);

        return fetch(getMockEndpoint())
            .then((response) => response.json())
            .then((mockEvents) => {
                mockEvents.forEach((event) => addEvent(event));
                setMessage(`Loaded ${mockEvents.length} mock events with then/catch.`, elements.remoteStatus);
            })
            .catch((error) => {
                setMessage(`Mock load failed: ${error.message}`, elements.remoteStatus);
            })
            .finally(() => {
                elements.loadingSpinner.hidden = true;
            });
    }

    async function loadMockEventsWithAsyncAwait() {
        elements.loadingSpinner.hidden = false;
        setMessage("Loading mock events using async/await...", elements.remoteStatus);

        try {
            const response = await fetch(getMockEndpoint());
            const mockEvents = await response.json();
            mockEvents.forEach((event) => addEvent(event));
            setMessage(`Loaded ${mockEvents.length} mock events with async/await.`, elements.remoteStatus);
        } catch (error) {
            setMessage(`Mock load failed: ${error.message}`, elements.remoteStatus);
        } finally {
            elements.loadingSpinner.hidden = true;
        }
    }

    async function submitRegistrationToServer(payload) {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Server rejected the registration request.");
        }

        return response.json();
    }

    elements.categoryFilter.addEventListener("change", (event) => {
        updateFilterState({ category: event.target.value });
    });

    elements.locationFilter.addEventListener("change", (event) => {
        updateFilterState({ location: event.target.value });
    });

    elements.searchInput.addEventListener("input", (event) => {
        updateFilterState({ search: event.target.value.trim() });
    });

    elements.searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            updateFilterState({ search: event.target.value.trim() });
        }
    });

    elements.clearFiltersBtn.addEventListener("click", () => {
        filterState.category = "all";
        filterState.location = "all";
        filterState.search = "";
        elements.categoryFilter.value = "all";
        elements.locationFilter.value = "all";
        elements.searchInput.value = "";
        renderEvents();
    });

    elements.loadMockBtn.addEventListener("click", () => {
        loadMockEventsWithThenCatch();
    });

    elements.loadAsyncBtn.addEventListener("click", () => {
        loadMockEventsWithAsyncAwait();
    });

    elements.simulateCancelBtn.addEventListener("click", () => {
        const selectedEventId = elements.eventSelect.value;

        if (!selectedEventId) {
            setMessage("Choose an event first if you want to test cancel flow.", elements.formMessage);
            return;
        }

        try {
            cancelRegistration(selectedEventId);
            setMessage("Cancel request handled from the form panel.", elements.formMessage);
        } catch (error) {
            setMessage(error.message, elements.formMessage);
        }
    });

    elements.registrationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const { elements: formElements } = form;

        console.log("Registration submit started");
        console.log("Registration payload preview", {
            name: formElements.fullName.value,
            email: formElements.email.value,
            eventId: formElements.eventSelect.value
        });

        if (!validateRegistrationFields(formElements)) {
            setMessage("Please fix the inline validation errors and try again.", elements.formMessage);
            return;
        }

        const selectedEvent = events.find((item) => item.id === formElements.eventSelect.value);

        if (!selectedEvent) {
            setMessage("Selected event is no longer available.", elements.formMessage);
            return;
        }

        if (!selectedEvent.checkAvailability()) {
            setMessage("Selected event is full.", elements.formMessage);
            return;
        }

        const payload = {
            name: formElements.fullName.value.trim(),
            email: formElements.email.value.trim(),
            selectedEvent: selectedEvent.name,
            eventId: selectedEvent.id,
            category: selectedEvent.category
        };

        try {
            registerUser(selectedEvent.id, { name: payload.name });
            console.log("Posting payload to mock API", payload);
            await submitRegistrationToServer(payload);
            setMessage(`Registration submitted for ${selectedEvent.name}. A confirmation was sent to ${payload.email}.`, elements.formMessage);
            form.reset();
            elements.fullNameError.textContent = "";
            elements.emailError.textContent = "";
            elements.eventSelectError.textContent = "";
        } catch (error) {
            console.error("Registration failed", error);
            setMessage(`Registration failed: ${error.message}`, elements.formMessage);
        }
    });

    if (window.jQuery) {
        window.jQuery("#registerBtn").click(function clickHandler() {
            window.jQuery(".eventCard").stop(true, true).fadeOut(100).fadeIn(200);
        });
    }

    populateFilters();
    renderEvents();
});