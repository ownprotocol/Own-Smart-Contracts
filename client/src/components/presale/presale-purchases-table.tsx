import { type PresalePurchase } from "@/types/presale";
import { TableHeader, TableRow } from "../table/table-common-components";
import { format } from "date-fns";
import { displayedEthAmount } from "@/lib/display";

interface PresaleTableProps {
  rows: PresalePurchase[];
  showTitle?: boolean;
}

function PresalePurchasesTable({ rows, showTitle = true }: PresaleTableProps) {
  const getClaimStatusDescription = (
    status: PresalePurchase["claimStatus"],
  ) => {
    if (status === "able-to-claim") {
      return "Can Claim";
    }

    if (status === "claimed") {
      return "Claimed";
    }

    return "Not Ready to Claim";
  };
  return (
    <div className="mt-1 md:mt-2">
      <div className="mx-auto max-w-3xl">
        <div className="py-1 md:py-4">
          <div className="px-4 md:px-6 lg:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                {showTitle && (
                  <h1 className="font-dm_mono text-[14px] font-[400] text-white md:text-[16px]">
                    Your Presale Purchases
                  </h1>
                )}
              </div>
            </div>
            <div className="mt-1 flow-root md:mt-2">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <TableHeader>DATE</TableHeader>
                        <TableHeader>OWN AMOUNT</TableHeader>
                        <TableHeader>USDT SPENT</TableHeader>
                        <TableHeader>PRICE</TableHeader>
                        <TableHeader>CLAIMABLE</TableHeader>
                      </tr>
                    </thead>
                    {rows.length === 0 ? (
                      <tbody className="divide-y divide-gray-800 font-dm_mono">
                        <tr>
                          <td colSpan={5} className="py-12 text-center">
                            No presale purchases found
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className="divide-y divide-gray-800 font-dm_mono">
                        {rows.map((presalePurchase) => (
                          <tr key={presalePurchase.timestamp.toString()}>
                            <TableRow>
                              {format(
                                presalePurchase.timestamp,
                                "hh:mm dd/MM/yyyy",
                              )}
                            </TableRow>
                            <TableRow>
                              {displayedEthAmount(presalePurchase.ownAmount)}
                            </TableRow>
                            <TableRow>
                              ${displayedEthAmount(presalePurchase.usdtAmount)}
                            </TableRow>
                            <TableRow>${presalePurchase.price}</TableRow>
                            <TableRow>
                              {getClaimStatusDescription(
                                presalePurchase.claimStatus,
                              )}
                            </TableRow>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresalePurchasesTable;
