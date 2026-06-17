import * as XLSX from 'xlsx';

export const exportRevenueToExcel = (transactions, month, year) => {
  // 1. Lọc toàn bộ giao dịch trùng khớp với Tháng và Năm được chọn trên UI
  const filteredData = transactions.filter(t => {
    const transDate = new Date(t.date);
    const matchMonth = (transDate.getMonth() + 1) === Number(month);
    const matchYear = transDate.getFullYear() === Number(year);
    return matchMonth && matchYear;
  });

  // 2. Chặn lại nếu tháng được chọn chưa có dữ liệu giao dịch
  if (filteredData.length === 0) {
    throw new Error(`Không có dữ liệu thu chi trong tháng ${month}/${year} để xuất file.`);
  }

  // Sắp xếp thứ tự các dòng theo trình tự ngày tăng dần
  filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

  let totalIncome = 0;
  let totalExpense = 0;

  // 3. Chuyển đổi dữ liệu sang dạng cấu trúc phẳng cho bảng Excel
  const rowData = filteredData.map((t, index) => {
    const isIncome = t.type === 'income';
    const amountNumber = Number(t.amount);

    if (isIncome) {
      totalIncome += amountNumber;
    } else {
      totalExpense += amountNumber;
    }

    return {
      'STT': index + 1,
      'Ngày giao dịch': new Date(t.date).toLocaleDateString('vi-VN'),
      'Danh mục': t.category?.name || 'Không phân loại',
      'Loại': isIncome ? 'Thu nhập (+)' : 'Chi tiêu (-)',
      'Số tiền (VNĐ)': isIncome ? amountNumber : -amountNumber,
      'Ghi chú / Mô tả': t.note || ''
    };
  });

  // 4. Đính kèm các dòng kết toán tài chính tổng hợp ở cuối bảng
  rowData.push({ 'STT': '', 'Ngày giao dịch': 'TỔNG THU NHẬP', 'Danh mục': '', 'Loại': '', 'Số tiền (VNĐ)': totalIncome, 'Ghi chú / Mô tả': '' });
  rowData.push({ 'STT': '', 'Ngày giao dịch': 'TỔNG CHI TIÊU', 'Danh mục': '', 'Loại': '', 'Số tiền (VNĐ)': -totalExpense, 'Ghi chú / Mô tả': '' });
  rowData.push({ 'STT': '', 'Ngày giao dịch': 'SỐ DƯ CÒN LẠI (THU - CHI)', 'Danh mục': '', 'Loại': '', 'Số tiền (VNĐ)': totalIncome - totalExpense, 'Ghi chú / Mô tả': '' });

  // 5. Tạo tập tin Excel và thiết lập độ rộng cột chống tràn chữ
  const worksheet = XLSX.utils.json_to_sheet(rowData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo tài chính');

  worksheet['!cols'] = [
    { wch: 6 },  
    { wch: 16 }, 
    { wch: 25 }, 
    { wch: 14 }, 
    { wch: 18 }, 
    { wch: 35 }  
  ];

  const fileLabel = String(month).padStart(2, '0') + `_${year}`;
  XLSX.writeFile(workbook, `Bao_Cao_Tai_Chinh_Thang_${fileLabel}.xlsx`);
};