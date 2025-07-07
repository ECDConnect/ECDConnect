
### Props of the `Table` Component:

- `rows`: An array containing row data for the table. It supports HTML elements, not limited to plain text

- `columns`: An array defining the columns of the table. Each object in this array has the following properties:
  - `field`: The name of the field corresponding to the data in the rows.
  - `use`: The display label of the column.

- `rowsPerPage`: An integer representing the number of rows per page in the table. Default is 10.

- `search`: An object containing configurations for the search functionality in the table.

- `actionButton`: An object containing configurations for an action button in the table. 

- `filters`: An array containing configurations for the filters in the table. 

- `onClearFilters`: A callback function that is called when the clear filters button is clicked.

- `onClickRow`: A callback function that is called when a row in the table is clicked.

- `onChangePage`: A callback function that is called when the current page of the table is changed.

### Example Usage

Here's how you can use the `Table` component:

```javascript
  const columns = [
    { field: 'id', use: 'Unique ID' },
    { field: 'name', use: 'Name' },
    { field: 'insertedDate', use: 'Date added' },
  ]

  const rows = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Name ${i}`,
    // You can use html elements in the data, it isn't restricted to just text
    subDistrict: <div className='bg-red-400 rounded-xl p-2'>Sub District {i}</div>,
    insertedDate: `Date ${i}`
  }))
```

```javascript
  <Table
    columns={columns}
    rows={rows}
    search={{
      placeholder: 'Search by unique ID or clinic name...',
      value: searchValue,
      onChange: search
    }}
    actionButton={{
      icon: 'PlusIcon',
      text: 'Add a clinic',
      onClick: () => console.log('Add a clinic')
    }}
    filters={[
      {
        options: subDistricts,
        placeholder: 'Sub-district',
        selectedOptions: subDistrictsFiltered,
        onChange: setSubDistrictsFiltered
      }
    ]}
    bulkActions={[
      {
        type: 'filled',
        color: 'secondary',
        textColor: 'white',
        text: 'Delete',
        onClick(selected) {
          console.log({ selected })
        },
      }
    ]}
    onClearFilters={clearFilters}
    onClickRow={(row) => console.log({ row })}
    onChangePage={(page) => console.log({ page })}
  />
```
