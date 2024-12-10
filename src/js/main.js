let occupiedRooms = JSON.parse(localStorage.getItem("occupiedRooms")) || [];

class Room {
  static ISH = 0.04;
  static IVA = 0.16;
  static id = occupiedRooms.length
    ? Math.max(...occupiedRooms.map((room) => room.id)) + 1
    : 1;

  constructor(roomType, basePrice, hours, roomNumber, guestId) {
    this.id = Room.id++;
    this.roomType = roomType;
    this.basePrice = basePrice;
    this.hours = hours;
    this.roomNumber = roomNumber;
    this.guestId = guestId.toUpperCase();
    this.roomRegisterTime = new Date().toLocaleString("es-MX");
    this.ISH = basePrice * Room.ISH;
    this.IVA = basePrice * Room.IVA;
    this.totalPrice = Math.ceil(basePrice + this.ISH + this.IVA);
  }
}

const basePrices = {
  Jacuzzi: 583.33,
  Sencilla: {
    6: 308.33,
    9: 458.33,
    12: 583.33,
    24: 666.66,
  },
};

const basePrice = (roomType, hours) =>
  roomType === "Jacuzzi"
    ? basePrices.Jacuzzi
    : roomType === "Sencilla"
    ? basePrices.Sencilla[hours] || 0
    : 0;

const resetForm = (form) => {
  form.reset();
  const roomTypeSelect = form.roomType;
  roomTypeSelect.innerHTML = `
    <option value="" disabled selected>Tipo de Habitación</option>
    <option value="Sencilla">Sencilla</option>
    <option value="Jacuzzi">Jacuzzi</option>
  `;
  const hoursSelect = form.hours;
  hoursSelect.innerHTML = `
    <option value="" disabled selected>Tiempo</option>
    <option value="6">6</option>
    <option value="9">9</option>
    <option value="12">12</option>
    <option value="24">24</option>
  `;
};

const createNewRoom = (event) => {
  event.preventDefault();
  const form = event.target;
  const roomType = form.roomType.value;
  const hours = parseInt(form.hours.value);
  const roomNumber = parseInt(form.roomNumber.value);
  const guestId = form.guestId.value;

  if (!roomType || isNaN(hours) || isNaN(roomNumber) || !guestId) {
    return;
  }

  const basePriceValue = basePrice(roomType, hours);

  const newRoom = new Room(
    roomType,
    basePriceValue,
    hours,
    roomNumber,
    guestId
  );

  console.log("New room: ", newRoom);

  occupiedRooms.push(newRoom);
  localStorage.setItem("occupiedRooms", JSON.stringify(occupiedRooms));

  renderOccupiedRooms();
  resetForm(form);
};

document.addEventListener("DOMContentLoaded", () => {
  const roomTypeSelect = document.querySelector("#roomType");
  const hoursSelect = document.querySelector("#hours");
  const occupiedRoomsList = document.querySelector("#occupiedRoomsList");

  roomTypeSelect.addEventListener("change", () => {
    const roomType = roomTypeSelect.value;
    hoursSelect.innerHTML = "";

    if (roomType === "Jacuzzi") {
      const option = document.createElement("option");
      option.value = "6";
      option.text = "6";
      hoursSelect.appendChild(option);
    } else if (roomType === "Sencilla") {
      const hoursOptions = [6, 9, 12, 24];
      hoursOptions.forEach((hour) => {
        const option = document.createElement("option");
        option.value = hour;
        option.text = hour;
        hoursSelect.appendChild(option);
      });
    }
  });

  document
    .querySelector("#createRoomForm")
    .addEventListener("submit", createNewRoom);

  occupiedRoomsList.addEventListener("click", (event) => {
    if (event.target.closest(".delete-btn")) {
      const roomId = parseInt(
        event.target.closest(".delete-btn").getAttribute("data-id")
      );
      deleteRoom(roomId);
    }
  });
});

const renderOccupiedRooms = () => {
  const occupiedRoomsList = document.querySelector("#occupiedRoomsList");
  if (!occupiedRoomsList) {
    return;
  }

  occupiedRoomsList.innerHTML = occupiedRooms
    .map(
      ({
        id = "",
        roomRegisterTime = "",
        guestId = "",
        roomNumber = "",
        totalPrice = "",
        roomType = "",
      }) => `
    <tr id='roomList'>
      <td>${id}</td>
      <td>${roomRegisterTime}</td>
      <td>${guestId}</td>
      <td>${roomNumber}</td>
      <td>${totalPrice}</td>
      <td>${roomType}</td>
      <td>
        <button class='delete-btn' data-id='${id}'>
          <svg width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fill="#000000" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path>
            </g>
          </svg>
        </button>
      </td>
    </tr>
  `
    )
    .join("");
};

const deleteRoom = (roomId) => {
  const roomToDelete = occupiedRooms.find((room) => room.id === roomId);
  if (roomToDelete) {
    occupiedRooms = occupiedRooms.filter((room) => room.id !== roomId);
    localStorage.setItem("occupiedRooms", JSON.stringify(occupiedRooms));
    renderOccupiedRooms();
  }
};

renderOccupiedRooms();
