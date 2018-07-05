exports.users = {
	name: "users",
	fields: ["user_id", "country_code", "number", "username", "profilepic", "status", "created_at"]
}

exports.otp = {
	name: "otp",
	fields: ["country_code", "number", "otp", "generation_time", "expiry"]
}

exports.admins = {
	name: "admins",
	fields: ["admin_id", "username", "email", "encrypted_password", "role"]
}

exports.merchants = {
	name: "merchants",
	fields: ["merchant_id", "name", "email", "encrypted_password", "country_code", "number", "alternate_country_code", "alternate_number", "status"]
}

exports.businesses = {
	name: "businesses",
	fields: ["merchant_id", "business_id", "name", "address", "type", "gstin", "status"]
}

exports.business_account_info = {
	name: "business_account_info",
	fields: ["merchant_id", "business_id", "accountholder_name", "account_number", "ifsc"]
}

exports.business_operators = {
	name: "business_operators",
	fields: ["merchant_id", "business_id", "operator_id", "username", "encrypted_password"]
}

exports.menus = {
	name: "menus",
	fields: ["menu_id","description", "created_on", "updated_on"]
}

exports.menu_categories = {
	name: "menu_categories",
	fields: ["menu_id", "category_id", "category_name"]
}

exports.menu_customisations = {
	name: "menu_customisations",
	fields: ["menu_id", "customisation_id", "name", "min_selections", "max_selections"]
}

