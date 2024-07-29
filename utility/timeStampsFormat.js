const timeStampFormat = () => {
  const date = new Date();

  const formatedDate = date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format);
  });
  return formatedDate;
};

const getMonthName = () => {
  const date = new Date();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthIndex = date.getMonth();
  return months[monthIndex];
};

module.exports = { timeStampFormat, getMonthName };
