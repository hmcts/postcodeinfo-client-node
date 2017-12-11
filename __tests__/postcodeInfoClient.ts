import { PostcodeInfoClient } from '../src'

const postcodeInfoClient: PostcodeInfoClient = new PostcodeInfoClient('<gibberish token>')

describe('postcodeInfoClient', () => {
  test('should return valid false if no postcode found', () =>
    postcodeInfoClient
      .lookupPostcode('123')
      .then(postcodeResponse => {
        expect(postcodeResponse.valid).toEqual(false)
      })
  )
  test('should return found postcodes', () =>
    postcodeInfoClient.lookupPostcode('SN15NB')
      .then(postcodeResponse => {
        expect(postcodeResponse.addresses[0]).toEqual({})
      })
  )
})
