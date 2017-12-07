import * as request from 'request-promise-native'
import { Address } from './address'
import { Point } from './point'
import { PostcodeInfoResponse } from './postcodeInfoResponse'

export class PostcodeInfoClient {
  constructor (private readonly apiToken: string,
               private readonly apiUrl: string = 'https://postcodeinfo.service.justice.gov.uk') {
  }

  public lookupPostcode (postcode: string): Promise<PostcodeInfoResponse> {
    if (!postcode) {
      throw new Error('Missing required postcode')
    }

    const headers = {
      Authorization: `Token ${this.apiToken}`
    }

    const postcodeQueryPromise = request.get({
      headers,
      resolveWithFullResponse: true,
      simple: false,
      uri: `${this.apiUrl}/addresses/?postcode=${postcode}`
    })

    const postcodeInfoPromise = request.get({
      headers,
      resolveWithFullResponse: true,
      simple: false,
      uri: `${this.apiUrl}/postcodes/${postcode}`
    })


    return Promise.all([postcodeQueryPromise, postcodeInfoPromise])
      .then(([postcodeQuery, postcodeInfo]) => {
        if (postcodeQuery.statusCode >= 500 || postcodeInfo.statusCode >= 500) {
          throw new Error('Error with postcode service')
        } else if (postcodeQuery.statusCode === 404 || postcodeInfo.statusCode === 404) {
          return new PostcodeInfoResponse(false)
        }

        const postcodeInfoBody = JSON.parse(postcodeInfo.body)
        const postcodeQueryBody = JSON.parse(postcodeQuery.body)

        return new PostcodeInfoResponse(
          postcodeInfo.statusCode === 200,
          postcodeInfoBody.latitude,
          postcodeInfoBody.longitude,
          postcodeInfoBody.local_authority,
          postcodeInfoBody.country,
          postcodeQueryBody.map((address: any) => {
              return new Address(
                address.uprn,
                address.organisation_name,
                address.department_name,
                address.po_box_number,
                address.building_name,
                address.sub_building_name,
                address.building_number,
                address.thoroughfare_name,
                address.dependent_thoroughfare_name,
                address.dependent_locality,
                address.double_dependent_locality,
                address.post_town,
                address.postcode,
                address.postcode_type,
                address.formatted_address,
                new Point(address.point.type, address.point.coordinates)
              )
            }
          )
        )
      })
  }


}
