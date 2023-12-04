const DealCrud = require('../controllers/crud/DealManagerCrud')

const allDeals = async (req, res) => {
    try {
        // destructuring the query 
        const { search, fromDate, toDate, page = 1, limit = 10, } = req.query;
        let filter = {}
        if (search) {
            // Using $regex to perform a partial text search on both dealName and accountName.name fields
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { dealName: { $regex: searchRegex } },
                { 'accountName.name': { $regex: searchRegex } },
                { 'createdBy.name': { $regex: searchRegex } },
            ];
        }


        if (fromDate && toDate) {
            filter.createdTime = {
                $gte: new Date(fromDate), // Greater than or equal to fromDate
                $lte: new Date(toDate)     // Less than or equal to toDate
            };
        }
        // Project only the dealName and accountName fields
        // const projection = { dealName: 1, 'accountName.name': 1 };

        // Options to limited the results with pagination options
        const totalDeals = await DealCrud.countDocuments()
        const totalPages = Math.ceil(totalDeals / limit)
        const options = {
            limit: limit,
            skip: (page - 1) * limit,
        }

        // sending this to sort by date by default 
        const sortType = ['createdTime', -1]
        const deals = await DealCrud.fetchAll(filter, options, sortType)
        /*  for testing the companies related to the deals
        deals.forEach(async (element) => {
            const companies = await BiginCompanies.findOne({ "companyId": element.accountName.id })
         }); 
        */
        res.status(200).json({
            message: "success",
            data: deals,
            currentPage: page,
            totalPages: totalPages,
            totalDeals: totalDeals
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed",
            error: error
        })

    }
}

const DealsBySalesPerson = async (req, res) => {
    try {
        if (req.query.lenght > 0) {
            const { search, page = 1, limit = 10, } = req.query;
            let filter = {}
            if (search) {
                // Using $regex to perform a partial text search on both dealName and accountName.name fields
                const searchRegex = new RegExp(search, 'i');
                filter.$or = [
                    { dealName: { $regex: searchRegex } },
                    { 'accountName.name': { $regex: searchRegex } },
                    { 'createdBy.name': { $regex: searchRegex } },
                ];
            }
            const totalDeals = await DealCrud.countDocuments()
            const totalPages = Math.ceil(totalDeals / limit)
            const options = {
                limit: limit,
                skip: (page - 1) * limit,
            }

            // sending this to sort by date by default 
            const sortType = ['date', -1]
            const dealBySalesPerson = await DealCrud.fetchBySalesPerson(filter, options, sortType)
            res.status(200).json({
                message: "success",
                data: dealBySalesPerson,
                currentPage: page,
                totalPages: totalPages,
                totalDeals: totalDeals
            })
        } else {
            const email = req.params.email
            const dealBySalesPerson = await DealCrud.fetchBySalesPerson(email)
            res.status(200).json({
                message: "success",
                data: dealBySalesPerson,
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "An Error Occured"
        })
    }
}

const DealsById = async (req, res) => {
    try {
        const dealId = req.params.data
        const salesDeal = await DealCrud.fetchById(dealId)
        res.status(200).json({
            message: "success",
            data: salesDeal
        })
    } catch (error) {
        res.status(500).json({
            message: "An Error Occured"
        })
    }
}



module.exports = { 
    allDeals,  
    DealsById, 
    DealsBySalesPerson
}


