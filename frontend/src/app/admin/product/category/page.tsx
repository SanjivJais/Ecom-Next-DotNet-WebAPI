import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "kewm@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "a@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "tq@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "wnks@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "qoml@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "mdqw@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "zd@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "oenm@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "wqfm@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "wdm@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "mow@example.com",
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
