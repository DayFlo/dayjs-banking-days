# dayjs-banking-days

This is a Day.js plugin that is meant to provide efficient ways for getting US banking days excluding US bank holidays.

- Inspired by [moment-holiday](https://github.com/kodie/moment-holiday) and [moment-business-days](https://www.npmjs.com/package/moment-business-days) intended for common US banking holidays

### Installation

Install via Bun, Yarn or NPM
```bash
bun add dayjs-banking-days
```


```bash
yarn add dayjs-banking-days
```

```bash
npm install dayjs-banking-days
```

## Usage

By default, this plugin considers the following holidays:
- New Year's Day
- Martin Luther King Jr. Day
- Presidents' Day
- Memorial Day
- Juneteenth
- Independence Day
- Labor Day
- Veterans Day
- Thanksgiving
- Christmas

You will need to import the plugin and activate it via the Day.js `.extend()` function

```javascript
import dayjs from 'dayjs'
import dayjsBankingDays from 'dayjs-banking-days'

dayjs.extend(dayjsBankingDays)
```

You can include custom dates by passing in an object that contains the one or both of the following properties:
- `fixedDateHolidays`
- `floatingDateHolidays`

Fixed date holidays always occur on the same date each year and are represent as a string with the format `MM-DD`, e.g. May 4th (Star Wars Day) would be `05-04`. Floating date holidays occur on a specific day of the month, represented with an object comprised of the key being the month, an array where the first element is the day, followed by the occurence count in the month, e.g. Columbus Day is the 2nd Monday in October and would be represented `{ 10: [1, 2]}`.

```javascript
import dayjs from 'dayjs'
import dayjsBankingDays from 'dayjs-banking-days'

dayjs.extend(dayjsBankingDays, {
    fixedDateHolidays: ['05-04'],
    floatingDateHolidays: {
        10: [1, 2]
    }
})
```
