import { useContext } from "react";
import UserContext from "../../../../Context/UserContext";

const IdentityInformation = () => {
    const { currentUserFullDetails } = useContext<any>(UserContext);

    return (
        <div className='flex gap-8 mt-2'>
            <div className='w-1/2'>
                <p className='underline'>Bank Details</p>
                <div className='flex gap-1'>
                    <p className='text-xs text-gray-400 mt-2'>
                        Review your banking information securely to ensure smooth financial transactions and account management.
                    </p>
                </div>
                <div className='gap-4 mt-4'>
                    <div>
                        <label htmlFor="accountHolderName" className="block text-sm/6 font-medium text-gray-900">
                            ACCOUNT HOLDER NAME
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    type="text"
                                    placeholder="ACCOUNT HOLDER NAME"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='gap-4 mt-2'>
                    <div>
                        <label htmlFor="accountHolderName" className="block text-sm/6 font-medium text-gray-900">
                            BANK NAME
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    id="bankName"
                                    name="bankName"
                                    type="text"
                                    placeholder="Bank Name"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div>
                        <label htmlFor="accountNo" className="block text-sm/6 font-medium text-gray-900">
                            ACCOUNT NO.
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    id="accountNo"
                                    name="accountNo"
                                    type="text"
                                    placeholder="Account No."
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="IFSCCode" className="block text-sm/6 font-medium text-gray-900">
                            IFSC CODE
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    id="IFSCCode"
                                    name="IFSCCode"
                                    type="text"
                                    placeholder="IFSC Code"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='gap-4 mt-2 mb-8'>
                    <div>
                        <label htmlFor="bankName" className="block text-sm/6 font-medium text-gray-900">
                            BANK NAME
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    id="bankName"
                                    name="bankName"
                                    type="text"
                                    placeholder="Bank Name"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[93%] border border-1 mt-1' />
            <div className='w-1/2'>
                <p className='underline'>Government ID's</p>
                <div className='flex gap-8'>
                    <p className='text-xs text-gray-400 mt-2'>
                        Manage your government-issued ID details.
                    </p>
                </div>
                <div>
                    <div className='grid grid-cols-2 gap-4 mt-4'>
                        <div>
                            <label htmlFor="aadharNo" className="block text-sm/6 font-medium text-gray-900">
                                AADHAR NO.
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        id="aadharNo"
                                        name="aadharNo"
                                        type="text"
                                        placeholder="AADHAR No."
                                        value={currentUserFullDetails.contactFeilds.aadharId}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="panNo" className="block text-sm/6 font-medium text-gray-900">
                                PAN NO.
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        id="panNo"
                                        name="panNo"
                                        type="text"
                                        placeholder="PAN No."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-2'>
                        <div>
                            <label htmlFor="passportNo" className="block text-sm/6 font-medium text-gray-900">
                                PASSPORT NO.
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        id="passportNo"
                                        name="passportNo"
                                        type="text"
                                        placeholder="Passport No."
                                        value={currentUserFullDetails?.contactFeilds?.passportNo}
                                        disabled
                                   />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="pfMemberId" className="block text-sm/6 font-medium text-gray-900">
                                PF MEMBER ID
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        id="pfMemberId"
                                        name="pfMemberId"
                                        type="text"
                                        placeholder="PF Member ID"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-2'>
                        <div>
                            <label htmlFor="uanNo" className="block text-sm/6 font-medium text-gray-900">
                                UAN NO.
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        id="uanNo"
                                        name="uanNo"
                                        type="text"
                                        placeholder="UAN No."
                                        value={currentUserFullDetails?.EmployeesKyc?.UANNo}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="esiNo" className="block text-sm/6 font-medium text-gray-900">
                                ESI NO.
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        id="esiNo"
                                        name="esiNo"
                                        type="text"
                                        placeholder="ESI No."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IdentityInformation