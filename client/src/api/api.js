const API_BASE_URL = "http://localhost:5000";
export const fetchCurrentLevel = async (setError, setSimplicity) => {
  try {
    setError("");
    const response = await fetch(`${API_BASE_URL}/get-level`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    setSimplicity(data.level);
  } catch (error) {
    console.error("Error fetching current level:", error);
    setError(
      "Failed to connect to the backend server. Using default level (3)."
    );
  }
};

export const fetchLevels = async (setError, setLevels) => {
  try {
    setError("");
    const response = await fetch(`${API_BASE_URL}/levels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    if (
      data.simplicity_levels &&
      Object.keys(data.simplicity_levels).length > 0
    ) {
      setLevels(data.simplicity_levels);
      console.log("Levels fetched from API:", data.simplicity_levels);
    } else {
      throw new Error("No levels data returned from API");
    }
  } catch (error) {
    console.error("Error fetching levels:", error);
    setError("Error fetching simplicity levels from server");
  }
};

export const selectLevel = async (level) => {
  const response = await fetch(`${API_BASE_URL}/select-level`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ level }),
  });

  return response;
};

export const explain = async (inputText, simplicity) => {
  const response = await fetch(`${API_BASE_URL}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: inputText,
      simplicity_level: simplicity,
    }),
  });

  return response;
};
