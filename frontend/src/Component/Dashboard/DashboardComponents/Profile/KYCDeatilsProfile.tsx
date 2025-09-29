import { InfoCircleOutlined } from '@ant-design/icons'
import { useContext } from 'react';
import UserContext from '../../../../Context/UserContext';

const KYCDeatilsProfile = () => {
    const { currentUserFullDetails } = useContext<any>(UserContext);

    return (
        <div>
            <p className='underline'>KYC Details</p>
            <div className='flex gap-28'>
                <p className='text-xs    text-gray-400 mt-2'>
                    Ensure smooth verification and compliance by keeping your KYC details accurate and up to date.
                </p>
            </div>
            <div className="mt-2 gap-4 grid grid-cols-4">
                <div>
                    <label htmlFor="gardianName" className="block text-sm font-medium text-gray-900">
                        GARDIAN NAME
                    </label>
                    <div className="mt-2">
                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                            <input
                                id="gardianName"
                                name="gardianName"
                                type="text"
                                placeholder="Guardian Name"
                                className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                value={currentUserFullDetails?.EmployeesKyc?.guardianName}
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="relationWithGardian" className="block text-sm font-medium text-gray-900">
                        RELATION
                    </label>
                    <div className="mt-2">
                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                            <input
                                id="relationWithGardian"
                                name="relationWithGardian"
                                type="text"
                                placeholder="Relation with Gardian"
                                className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                value={currentUserFullDetails?.EmployeesKyc?.relationWithGurdian}
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-900">
                        NATIONALITY
                    </label>
                    <div className="mt-2">
                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                            <input
                                id="nationality"
                                name="nationality"
                                type="text"
                                placeholder="Nationality"
                                className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                value={currentUserFullDetails?.EmployeesKyc?.nationality}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex gap-2 mt-3'>
                <div className="rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input
                        id="isInternationalWorker"
                        name="isInternationalWorker"
                        type="checkbox"
                        disabled
                        className="py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                </div>
                <label htmlFor="isInternationalWorker" className="flex items-center text-sm/6 font-medium text-gray-900">
                    Is International Worker
                </label>
            </div>
            <div className='flex gap-2 mt-2'>
                <div className="rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input
                        id="isPhysicalHandicap"
                        name="isPhysicalHandicap"
                        type="checkbox"
                        disabled
                        className="py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                </div>
                <label htmlFor="isPhysicalHandicap" className="flex items-center text-sm/6 font-medium text-gray-900">
                    Is Physical Handicap
                </label>
            </div>
            <hr style={{ width: '74.5%', marginTop: '10px' }} />
            <div className='w-[74.5%]'>
                <label htmlFor="isPhysicalHandicap" className="flex items-center text-lg my-2 font-medium text-gray-900">
                    Nominees
                </label>
                <div className="mt-2 gap-4 grid grid-cols-4">
                    <div>
                        <label htmlFor="gardianName" className="block text-sm font-medium text-gray-900">
                            NAME
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    id="nomineesName"
                                    name="nomineesName"
                                    type="text"
                                    placeholder="Name"
                                    className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    value={currentUserFullDetails?.EmployeesKyc?.nominees[0]?.nomineesName}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="relationWithGardian" className="block text-sm font-medium text-gray-900">
                            RELATION
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    id="relationWithGardian"
                                    name="relationWithGardian"
                                    type="text"
                                    placeholder="Relation with Guardian"
                                    className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    value={currentUserFullDetails?.EmployeesKyc?.nominees[0]?.relationWithNominee}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="doateofbirth" className="block text-sm font-medium text-gray-900">
                            DOB
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    id="doateofbirth"
                                    name="doateofbirth"
                                    type="date"
                                    className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    value={currentUserFullDetails?.EmployeesKyc?.nominees[0]?.DOB}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="percentage" className="block text-sm font-medium text-gray-900">
                            PERCENTAGE
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    id="percentage"
                                    name="percentage"
                                    type="text"
                                    placeholder="Percentage"
                                    className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    value={currentUserFullDetails?.EmployeesKyc?.nominees[0]?.percentage}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr style={{ width: '74.5%', marginTop: '10px' }} />
            <div className='flex gap-2 mt-2'>
                <div className="rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input
                        id="dependents"
                        name="dependents"
                        type="checkbox"
                        disabled
                        className="py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                </div>
                <div className='flex gap-1'>
                    <label htmlFor="dependents" className="flex items-center text-sm/6 font-medium text-gray-900">
                        Dependents
                    </label>
                    <InfoCircleOutlined />
                </div>
            </div>
        </div>
    )
}

export default KYCDeatilsProfile