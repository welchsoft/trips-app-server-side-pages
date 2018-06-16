class User {

  constructor(userName, password) {
    this.userName = userName
    this.password = password
    this.userTrips = []
//consider using GUID instead its a unique timestamp
    this.userUnique = this.userName+(new Date())

  }
  addTrip(trip){
    this.userTrips.push(trip)
      }

  removeTrip(trip){

    let index = this.userTrips.indexOf(trip)

    if(index !== -1){
      this.userTrips.splice(index,1)
    }

  }

}

module.exports = User
