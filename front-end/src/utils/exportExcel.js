import * as XLSX from 'xlsx';

export const exportRevenueToExcel = (transactions, month, year) => {
  // 1. Lọc và chuẩn hóa dữ liệu: Chỉ lấy các giao dịch Thu nhập (income) của tháng/năm được chọn
  const revenueData = transactions
    .filter(t => t.type === 'income')
    .map((t, index) => ({
      'STT': index + 1,
      'Ngày giao dịch': new Date(t.date).toLocaleDateString('vi-VN'),
      'Danh mục': t.categoryName || t.Category?.name || 'Không phân loại',
      'Số tiền (VNĐ)': t.amount,
      'Ghi chú / Mô tả': t.description || ''
    }));

  if (revenueData.length === 0) {
    throw new Error(`Không có dữ liệu doanh thu trong tháng ${month}/${year} để xuất file.`);
  }

  // 2. Tính tổng doanh thu để thêm vào dòng cuối cùng
  const totalRevenue = revenueData.reduce((sum, item) => sum + item['Số tiền (VNĐ)'], 0);
  revenueData.push({
    'STT': '',
    'Ngày giao dịch': 'TỔNG CỘNG DOANH THU',
    'Danh mục': '',
    'Số tiền (VNĐ)': totalRevenue,
    'Ghi chú / Mô tả': ''
  });

  // 3. Tiến hành tạo Workbook và Sheet bằng thư viện xlsx
  const worksheet = XLSX.utils.json_to_sheet(revenueData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Doanh thu');

  // 4. Thiết lập độ rộng tự động cho các cột trong Excel để không bị che chữ
  const maxProps = [{ wch: 6 }, { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 30 }];
  worksheet['!cols'] = maxProps;

  // 5. Xuất và tự động tải file về máy người dùng
  const fileName = `Bao_Cao_Doanh_Thu_Thang_${month}_${year}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};