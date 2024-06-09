# Yellow cabs trips data dashboard

## Getting Started

To get started, you need to have Node.js installed on your machine. You can download it from [here](https://nodejs.org/).

Run the following commands to get started:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## How I've approached the problem

The goal of this project is to create a dashboard that displays the trips data from the Yellow cabs API from New York City published in a Tinybird pipe.

### Understanding the data

First of all, we have an API published in the [following URL](https://api.tinybird.co/endpoint/t_f3b68895534049bf859f38a8e5ebc51a?token=p.eyJ1IjogIjdmOTIwMmMzLWM1ZjctNDU4Ni1hZDUxLTdmYzUzNTRlMTk5YSIsICJpZCI6ICJmZTRkNWFiZS05ZWIyLTRjMjYtYWZiZi0yYTdlMWJlNDQzOWEifQ.P67MfoqTixyasaMGH5RIjCrGc0bUKvBoKMwYjfqQN8c). The first task was to understand the data structure and what data would be useful to display in the dashboard.

Playing around with the API, I've noticed that the amount of rows was huge, so I've decided to find a way to fetch only useful information about the trips.

Checking the [Tinybird API docs](https://www.tinybird.co/docs), I've realized that I could use regular SQL queries (with some tweaks) to filter the data using the Query API.

So, after a few test querys, I've focused on these data:

- Min and max dates where the trips were made
- Total amount of trips
- Trip prices
- Trip distances
- Trip durations
- Payment method used
  - For this I found some reference about the payment method codes in the [following URL](https://www1.nyc.gov/assets/tlc/downloads/pdf/data_dictionary_trip_records_yellow.pdf) that I thought it would be related.

### Fetching the data

To fetch the data, I've created a service to make some requests to the API and filter the data using SQL queries.

Since there were a lot of different queries to be made, I've tried to improve performance by making all the requests in parallel using `Promise.all`.

In addition, I've noticed that there were some rows with data that would not be useful for the dashboard, like negative prices, trip distances or trip durations or even without passengers. So I've added some filters to remove these rows and show a more normalized data.

### Displaying the data

For this I had some doubts at first because I wanted a nice UI but I didn't want to spend too much doing styles and layout.

At last, I've decided to go for [Material UI](https://mui.com/). It has a lot of prebuild components and charts that I could use to display the data in a nice way.

The result is a simple dashboard with some cards displaying the key data (total trips, average trip price, average trip duration and average trip distance) and a few charts displaying the data in a more visual way.

The first chart is a bar chart that displays the trip cost by intervals. The second chart is a pie chart that displays the payment methods used in the trips.

Also, in the top of the page, there is a date picker that allows the user to filter the data by date. When the used selects a date range, the data is fetched again and the dashboard is updated.

You can use the "Share this report" button, to copy the URL with the selected date range to share with someone else.

## Testing

I've created some unit tests for the service that fetches the data from the API. You can run the tests with the following command:

```bash
npm run test
```
