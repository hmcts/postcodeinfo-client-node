import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'
import { Address } from './address'
import { Point } from './point'
import { PostcodeInfoResponse } from './postcodeInfoResponse'

export class PostcodeInfoClient {
  constructor (private readonly apiToken: string,
               private readonly request: requestDefault.RequestAPI<requestPromise.RequestPromise,
                 requestPromise.RequestPromiseOptions,
                 requestDefault.RequiredUriUrl> = requestPromise,
               private readonly apiUrl: string = 'https://postcodeinfo.service.justice.gov.uk') {
  }

  public lookupPostcode (postcode: string): Promise<PostcodeInfoResponse> {
    if (!postcode) {
      return Promise.reject(new Error('Missing required postcode'))
    }

    const postcodeQueryPromise = this.getUri(`/addresses/?postcode=${postcode}`)
    const postcodeInfoPromise = this.getUri(`${this.apiUrl}/postcodes/${postcode}`)

    return Promise.all([postcodeQueryPromise, postcodeInfoPromise])
      .then(([postcodeQuery, postcodeInfo]) => {
        if (postcodeQuery.statusCode >= 500 || postcodeInfo.statusCode >= 500) {
          throw new Error('Error with postcode service')
        } else if (postcodeQuery.statusCode === 404 || postcodeInfo.statusCode === 404) {
          return new PostcodeInfoResponse(false)
        } else if (postcodeQuery.statusCode === 401 || postcodeInfo.statusCode === 401) {
          throw new Error('Authentication failed')
        }

        const postcodeInfoBody = JSON.parse(postcodeInfo.body)
        const postcodeQueryBody = JSON.parse(postcodeQuery.body)

        return new PostcodeInfoResponse(
          postcodeInfo.statusCode === 200,
          postcodeInfoBody.centre.coordinates[1],
          postcodeInfoBody.centre.coordinates[0],
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

  private getUri (path: string): Promise<any> {
    return this.request.get({
      headers: this.headers,
      json: false,
      resolveWithFullResponse: true,
      simple: false,
      uri: `${this.apiUrl}${path}`
    })
  }

  private get headers (): object {
    return {
      Authorization: `Token ${this.apiToken}`
    }
  }


}
