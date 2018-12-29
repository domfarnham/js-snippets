import { get } from 'https'
import { STATUS_CODES } from 'http'
import { printError } from './printError'
const users = process.argv.slice(2)

function printMessage (username, badgeCount, points) {
  const message = `${username} has ${badgeCount} total badge(s) and ${points} points in JavaScript`
  console.log(message)
}

function getProfile (username) {
  try {
    const request = get(`https://teamtreehouse.com/${username}.json`, response => {
      if (response.statusCode === 200) {
        let body = ''

        response.on('data', data => {
          body += data.toString()
        })

        response.on('end', () => {
          try {
            const profile = JSON.parse(body)
            printMessage(username, profile.badges.length, profile.points.JavaScript)
          } catch (error) {
            printError(error)
          }
        })
      } else {
        const message = `There was an error getting the profile for ${username} (${STATUS_CODES[response.statusCode]})`
        const statusCodeError = new Error(message)
        printError(statusCodeError)
      }
    })

    request.on('error', printError)
  } catch (error) {
    printError(error)
  }
}

users.forEach(getProfile)
