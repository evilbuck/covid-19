# SARS 2.0

## Install
1. `yarn`
2. `docker-compose up -d`
3. `yarn db:create`
4. `yarn db:migrate`
5. `yarn data:refresh`


It consists of two tables. `covid_stats` which contains deaths and cases by county and `counties` which contains population information.

There are a couple basic reports that I must have used for something and probably still work. They're based on [feathersjs](https://feathersjs.com) service pattern.

I encourage PR's, and I don't mind criticism. It's a side project, I know I was lazy.
