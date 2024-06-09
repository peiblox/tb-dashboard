import QueryCondition from '@/types/querys';
import { Dayjs } from 'dayjs';

class TripDataService {
  private normalizedConditions: Array<QueryCondition>

  private startDate: Dayjs | null = null
  private endDate: Dayjs | null = null

  constructor() {
    this.normalizedConditions = [
      { field: 'total_amount', operator: '>', value: 0 },
      { field: 'total_amount', operator: '<', value: 1000 },
      { field: 'tpep_dropoff_datetime - tpep_pickup_datetime', operator: '>', value: 0 },
      { field: 'trip_distance', operator: '>', value: 0 },
      { field: 'passenger_count', operator: '>', value: 0}
    ]
  }

  private getNormalizedQuery(useDates = true) {
    const query = this.normalizedConditions.map(condition => {
      return `${condition.field} ${condition.operator} ${condition.value}`
    }).join(' AND ')

    if (useDates && this.startDate && this.endDate) {
      const start = this.startDate.format('YYYY-MM-DD')
      const end = this.endDate.format('YYYY-MM-DD')
      return `${query} AND tpep_pickup_datetime >= '${start} 00:00:00' AND tpep_pickup_datetime <= '${end} 23:59:59'`
    }

    return query
  }

  async getData(startDate?: Dayjs | null, endDate?: Dayjs | null) {
    if (startDate && endDate) {
      this.startDate = startDate
      this.endDate = endDate
    }
    const [
      totalTrips,
      amountData,
      avgTripAmount,
      tripsByPaymentType,
      avgTripDuration,
      avgTripDistance
  ] = await Promise.all([
      this.getTotalTrips(),
      this.getAmountData(),
      this.getAvgAmount(),
      this.getTripsByPaymentType(),
      this.getAvgTripDuration(),
      this.getAvgTripDistance(),
    ])

    return {
      totalTrips, // Used
      amountData, // Used
      avgTripAmount, // Used
      tripsByPaymentType, // Used
      avgTripDuration, // Used
      avgTripDistance, // Used
    }
  }

  async queryTripdata(query: string) {
    const params = new URLSearchParams()
    params.set('q', query)
    const url = new URL(`https://api.tinybird.co/v0/pipes/yellow_tripdata_2017_pipe.json?${params.toString()}`)

    const result = await fetch(url, {
      headers: {
        Authorization: 'Bearer p.eyJ1IjogIjdmOTIwMmMzLWM1ZjctNDU4Ni1hZDUxLTdmYzUzNTRlMTk5YSIsICJpZCI6ICJmZTRkNWFiZS05ZWIyLTRjMjYtYWZiZi0yYTdlMWJlNDQzOWEifQ.P67MfoqTixyasaMGH5RIjCrGc0bUKvBoKMwYjfqQN8c'
      }
    })
      .then(r => r.json())
      .then(r => r)
      .catch(e => e.toString())

    return result.rows !== 0 ? result.data : false
  }

  async getMinMaxDates() {
    const query = [
      "SELECT min(DATE(tpep_pickup_datetime)) as min_date, max(DATE(tpep_pickup_datetime)) as max_date",
      "FROM _",
      "WHERE " + this.getNormalizedQuery(false)
    ].join(' ')

    const result = await this.queryTripdata(query)

    return { ...result[0] }
  }

  async getTotalTrips() {
    const query = [
      "SELECT count() as total_trips",
      "FROM _",
      "WHERE " + this.getNormalizedQuery(),
    ].join(' ')

    const result = await this.queryTripdata(query)

    return result[0].total_trips
  }

  async getAmountData() {
    const query = [
      "SELECT count() as trips,",
      "CASE",
        "WHEN total_amount > 0 AND total_amount < 10 THEN '0-10'",
        "WHEN total_amount >= 10 AND total_amount < 20 THEN '10-19'",
        "WHEN total_amount >= 20 AND total_amount < 30 THEN '20-29'",
        "WHEN total_amount >= 30 AND total_amount < 40 THEN '30-39'",
        "WHEN total_amount >= 40 AND total_amount < 50 THEN '40-49'",
        "ELSE '> 50'",
      "END AS amount_interval",
      "FROM _ ",
      "WHERE " + this.getNormalizedQuery(),
      "GROUP BY amount_interval",
      "ORDER BY amount_interval asc"
    ].join(' ')

    const result = await this.queryTripdata(query)

    return result
  }

  async getAvgAmount() {
    const query = [
      "SELECT avg(total_amount) as avg_amount",
      "FROM _",
      "WHERE " + this.getNormalizedQuery()
    ].join(' ')

    const result = await this.queryTripdata(query)

    return result && result['0'].avg_amount
  }

  async getTripsByPaymentType() {
    const query = [
      "SELECT count() as trips, payment_type",
      "FROM _",
      "WHERE " + this.getNormalizedQuery(),
      "GROUP BY payment_type"
    ].join(' ')

    const result = await this.queryTripdata(query)

    return result
  }

  async getAvgTripDuration() {
    const query = [
      "SELECT avg(tpep_dropoff_datetime - tpep_pickup_datetime) as avg_duration",
      "FROM _",
      "WHERE " + this.getNormalizedQuery()
    ].join(' ')

    const result = await this.queryTripdata(query)

    return result && result['0'].avg_duration
  }

  async getAvgTripDistance() {
    const query = [
      "SELECT avg(trip_distance) as avg_distance",
      "FROM _",
      "WHERE " + this.getNormalizedQuery()
    ].join(' ')

    const result = await this.queryTripdata(query)

    return result && result['0'].avg_distance
  }
}

export default TripDataService
