import * as fs from 'fs'
import * as nock from 'nock'
import * as path from 'path'
import * as request from 'request-promise-native'
import { PostcodeInfoClient } from '../src'

const mockPostcode = 'http://localhost'
const postcodeInfoClient: PostcodeInfoClient = new PostcodeInfoClient('1234', request, mockPostcode)

describe('postcodeInfoClient', () => {
  test('should return valid false if no postcode found', () => {
      nock(mockPostcode)
        .get(/\/addresses\/\?postcode=.+/)
        .reply(404, [])

      nock(mockPostcode)
        .get(/\/postcodes\/.+/)
        .reply(404)

      return postcodeInfoClient
        .lookupPostcode('123')
        .then(postcodeResponse => {
          expect(postcodeResponse).toEqual({ valid: false })
        })
    }
  )
  test('should return found postcodes', () => {
      nock(mockPostcode)
        .get(/\/addresses\/\?postcode=.+/)
        .reply(200, fs.readFileSync(path.join(__dirname, 'mockAddressResponse.json')))

      nock(mockPostcode)
        .get(/\/postcodes\/.+/)
        .reply(200, fs.readFileSync(path.join(__dirname, 'mockPostcodeLookupResponse.json')))

      return postcodeInfoClient.lookupPostcode('SN15NB')
        .then(postcodeResponse => {
          expect(postcodeResponse).toEqual(
            {
              addresses: [{
                buildingName: 'THE HOUSE NAME',
                buildingNumber: 30,
                departmentName: '',
                dependentLocality: '',
                dependentThoroughfareName: '',
                doubleDependentLocality: '',
                formattedAddress: 'An organisation name\nThe house name\n30 A square\nLondon\nWAAA 5CD',
                organisationName: 'AN ORGANISATION NAME',
                poBoxNumber: '',
                point: { 'coordinates': [-0.1212324, 23.5022039], 'type': 'Point' },
                postTown: 'LONDON',
                postcode: 'WAAA 5CD',
                postcodeType: 'L',
                subBuildingName: '',
                thoroughfareName: 'A THOROUGH FARE',
                uprn: '10223432661'
              }],
              country: { 'gss_code': 'E92000001', 'name': 'England' },
              latitude: 23.5022039,
              localAuthority: { 'gss_code': 'E09000033', 'name': 'Westminster' },
              longitude: -0.1212324,
              valid: true
            }
          )
        })
    }
  )
  test('should reject promise if no postcode', () =>
    expect(postcodeInfoClient.lookupPostcode('')).rejects.toEqual(new Error('Missing required postcode'))
  )
})
