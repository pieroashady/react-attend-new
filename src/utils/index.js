import Parse from 'parse';
import moment from 'moment';

export const checkUser = () => {
	const user = Parse.User.current();

	if (user) {
		console.log('Ada user');
		console.log(user);
		return true;
	}

	return false;
};

export const getUsername = () => {
	const user = Parse.User.current();

	if (user) {
		return user.get('fullname').split(' ')[0];
	}

	return false;
};

export const getLeaderId = () => {
	console.log(Parse.User.current().get('leaderId').id);
	return Parse.User.current().get('leaderId').id;
};

export const getCurrentUser = () => {
	return Parse.User.current();
};

export const convertDate = (date, desiredFormat) => {
	return moment(date).format(desiredFormat);
};

export const handleConvert = (key) => {
	switch (key) {
		case 'Absen':
			return 'Absence';
		case 'Izin':
			return 'Izin';
		case 'Cuti':
			return 'Izin';
		case 'Terlambat':
			return 'Late';
		case 'Lembur':
			return 'Overtime';
		case 'Pulang Cepat':
			return 'EarlyLeave';
		default:
			break;
	}
};
