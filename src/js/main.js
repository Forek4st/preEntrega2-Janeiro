const occupiedRooms = [];

class Room {
  static ISH = 0.04;
  static IVA = 0.16;
  static id = 1;

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

const basePrice = (roomType, hours) => {
  if (roomType === "Jacuzzi") {
    return 583.33;
  } else if (roomType === "Sencilla") {
    switch (hours) {
      case 6:
        return 308.33;
      case 9:
        return 458.33;
      case 12:
        return 583.33;
      case 24:
        return 666.66;
      default:
        return 0;
    }
  } else {
    return 0;
  }
};

const createNewRoom = (event) => {
  event.preventDefault();
  const form = event.target;
  const roomType = form.roomType.value;
  const hours = parseInt(form.hours.value);
  const roomNumber = parseInt(form.roomNumber.value);
  const guestId = form.guestId.value;
  const basePriceValue = basePrice(roomType, hours);
  const newRoom = new Room(
    roomType,
    basePriceValue,
    hours,
    roomNumber,
    guestId
  );
  occupiedRooms.push(newRoom);
  renderOccupiedRooms();
  console.log(newRoom);
  form.reset();
};

document.addEventListener("DOMContentLoaded", () => {
  const roomTypeSelect = document.querySelector("#roomType");
  const hoursSelect = document.querySelector("#hours");

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
});

const renderOccupiedRooms = () => {
  const occupiedRoomsList = document.querySelector("#occupiedRoomsList");
  occupiedRoomsList.innerHTML = occupiedRooms
    .map(
      (room) => `
    <tr>
      <td>${room.id}</td>
      <td>${room.roomRegisterTime}</td>
      <td>${room.guestId}</td>
      <td>${room.roomNumber}</td>
      <td>${room.totalPrice}</td>
      <td>${room.roomType}</td>
    </tr>
  `
    )
    .join("");
};

renderOccupiedRooms();
