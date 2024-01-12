const getDarkMode = () => {
    return localStorage.getItem("darkMode") === "true"
}

const storage = {
    getDarkMode
}

export default storage