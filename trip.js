class Trip {

  constructor(title, imageURL, dateOfDeparture, dateOfReturn) {
    this.title = title
    this.imageURL = imageURL
    this.dateOfDeparture = dateOfDeparture
    this.dateOfReturn = dateOfReturn
//consider using GUID instead its a unique timestamp
    this.tripId = this.title+(new Date())

  }

}

module.exports = Trip
