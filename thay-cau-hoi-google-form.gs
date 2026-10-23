/**
 * THAY TOÀN BỘ CÂU HỎI GOOGLE FORM – KHẢO SÁT QUÀ TẶNG KHÁCH HÀNG (GU DECOR 3D)
 * Nguồn câu hỏi: Google Doc "GU DECOR 3D - PROJECT 2", tab "BỘ CÂU HỎI KHẢO SÁT" (33 câu).
 *
 * CÁCH DÙNG
 * 1. Mở Google Form cần thay → bấm ⋮ (góc trên phải) → "Trình chỉnh sửa tập lệnh" (Apps Script).
 * 2. Xóa code mặc định, dán toàn bộ file này vào, bấm Lưu.
 * 3. Chọn hàm `thayCauHoi` → bấm Run → cấp quyền khi Google hỏi.
 *
 * LƯU Ý: Script XÓA HẾT câu hỏi đang có trong Form rồi tạo lại. Nếu Form đã có câu trả lời,
 * hãy tải bảng câu trả lời về (hoặc tạo bản sao Form) trước khi chạy.
 *
 * Nếu chạy script độc lập (không mở từ Form), dán link Form vào FORM_URL.
 */
const FORM_URL = '';

const TIEU_DE = 'Khảo sát nhu cầu và hành vi lựa chọn quà tặng khách hàng của doanh nghiệp';
const MO_TA = 'GU Decor 3D thực hiện khảo sát nhằm tìm hiểu cách doanh nghiệp lựa chọn quà tặng khách hàng. ' +
  'Khảo sát mất khoảng 7–10 phút. Thông tin chỉ dùng cho mục đích nghiên cứu. Xin trân trọng cảm ơn Anh/Chị!';

// type: 'page' = sang phần mới, 'info' = khối thông tin, 'radio' = chọn một, 'check' = chọn nhiều
// other: true = có ô "Khác" tự nhập; max: số đáp án tối đa; ketThucNeuChonCuoi: chọn đáp án cuối → nộp form
const NOI_DUNG = [
  { type: 'page', title: 'PHẦN 1: THÔNG TIN VÀ SÀNG LỌC', first: true },
  { type: 'radio', title: 'Câu 1: Vai trò hiện tại của Anh/Chị tại doanh nghiệp là gì?', other: true, options: [
    'Marketing/Truyền thông.',
    'Hành chính/Nhân sự.',
    'Mua hàng.',
    'Kinh doanh/Chăm sóc khách hàng.',
    'Ban giám đốc/Chủ doanh nghiệp.'] },
  { type: 'radio', title: 'Câu 2: Doanh nghiệp của Anh/Chị hoạt động trong lĩnh vực nào?', other: true, options: [
    'Sản xuất, gia công.',
    'Bán lẻ, thương mại điện tử, phân phối đa ngành.',
    'Marketing, truyền thông, quảng cáo, tổ chức sự kiện.',
    'Giáo dục, đào tạo, tư vấn.',
    'Bất động sản, xây dựng, nội thất.',
    'Du lịch, lưu trú.',
    'Ăn uống, thực phẩm, đồ uống.',
    'Y tế, chăm sóc sức khỏe, làm đẹp (spa, salon tóc, massage,...).',
    'Tài chính, kế toán, bảo hiểm, pháp lý.'] },
  { type: 'radio', title: 'Câu 3: Doanh nghiệp của Anh/Chị hiện tại có quy mô bao nhiêu nhân sự?', options: [
    'Dưới 10 người.',
    '10 - 49 người.',
    '50 - 99 người.',
    '100 - 199 người.',
    'Từ 200 người trở lên.',
    'Không rõ.'] },
  { type: 'radio', title: 'Câu 4: Trụ sở hoặc cơ sở kinh doanh chính của doanh nghiệp Anh/Chị thuộc khu vực nào?', options: [
    'Miền Bắc.',
    'Miền Trung và Tây Nguyên.',
    'Miền Nam.'] },
  { type: 'radio', title: 'Câu 5: Anh/Chị có tham gia hoặc có thể tham gia vào việc đề xuất, lựa chọn, đặt mua hay phê duyệt quà tặng khách hàng tại doanh nghiệp không?',
    ketThucNeuChonCuoi: true, options: [
    'Có tham gia quyết định hoặc phê duyệt.',
    'Trực tiếp phụ trách tìm kiếm nhà cung cấp và đặt quà.',
    'Tham gia đề xuất, đánh giá hoặc lựa chọn quà.',
    'Chưa từng tham gia, nhưng sẽ hoặc có thể phụ trách khi doanh nghiệp phát sinh nhu cầu.',
    'Không tham gia, không nắm rõ thông tin.'] },

  // Câu 6 cần một phần riêng vì Google Form chỉ cho rẽ nhánh theo 1 câu trong mỗi phần.
  { type: 'page', title: 'PHẦN 1: THÔNG TIN VÀ SÀNG LỌC (tiếp)' },
  { type: 'radio', title: 'Câu 6: Tình trạng triển khai quà tặng khách hàng của doanh nghiệp Anh/Chị hiện tại là gì?',
    ketThucNeuChonCuoi: true, options: [
    'Đã từng tặng quà và tôi nắm được thông tin về ít nhất một đợt.',
    'Đã từng tặng quà nhưng tôi không nắm được thông tin cụ thể.',
    'Đã cân nhắc nhưng chưa từng triển khai.',
    'Chưa từng cân nhắc việc tặng quà khách hàng.',
    'Không rõ doanh nghiệp đã triển khai hay chưa.'] },

  { type: 'page', title: 'PHẦN 2: HÀNH VI TẶNG QUÀ KHÁCH HÀNG',
    help: 'Từ câu 7 đến câu 11, Anh/Chị vui lòng trả lời theo đợt tặng quà gần nhất mà Anh/Chị nắm được thông tin.' },
  { type: 'radio', title: 'Câu 7: Lần gần nhất doanh nghiệp tặng quà cho khách hàng là khi nào và cho dịp gì?', other: true, options: [
    'Lễ, Tết.',
    'Hội nghị/Hội thảo/Triển lãm/Sự kiện.',
    'Khai trương/Ra mắt sản phẩm hoặc dịch vụ.',
    'Kỷ niệm thành lập doanh nghiệp/thương hiệu.',
    'Cảm ơn sau khi khách hàng mua hàng hoặc ký hợp đồng.',
    'Chăm sóc khách hàng thân thiết/VIP.',
    'Chương trình khuyến mại/Thúc đẩy mua hàng.',
    'Sinh nhật hoặc cột mốc riêng của khách hàng.'] },
  { type: 'radio', title: 'Câu 8: Mục tiêu chính của đợt tặng quà đó là gì?', other: true, options: [
    'Giúp khách hàng biết đến hoặc ghi nhớ thương hiệu.',
    'Thu hút khách hàng ghé gian hàng/tham gia hoạt động.',
    'Khuyến khích mua hàng hoặc dùng thử.',
    'Cảm ơn và duy trì quan hệ với khách hàng.',
    'Khuyến khích khách hàng quay lại mua.',
    'Khuyến khích khách hàng chia sẻ hoặc giới thiệu thương hiệu.',
    'Không rõ.'] },
  { type: 'check', title: 'Câu 9: Doanh nghiệp đã chọn những loại quà nào trong đợt tặng quà trên?', max: 3, other: true, options: [
    'Sản phẩm của doanh nghiệp/Sản phẩm dùng thử.',
    'Voucher/Phiếu quà tặng/Phiếu giảm giá.',
    'Thực phẩm/Đồ uống/Giỏ quà.',
    'Móc khóa/Huy hiệu/Phụ kiện nhỏ.',
    'Bút/Sổ tay/Lịch.',
    'Bình nước/Ly/Cốc.',
    'Túi/Áo/Mũ/Ô.',
    'Đồ dùng nhỏ để bàn hoặc trang trí.',
    'Mascot/Mô hình/Đồ sưu tầm.',
    'Quà tặng công nghệ.'] },
  { type: 'radio', title: 'Câu 10: Doanh nghiệp đã chuẩn bị khoảng bao nhiêu phần quà trong đợt đó?', options: [
    'Dưới 30 phần.',
    '30 - 49 phần.',
    '50 - 99 phần.',
    '100 - 299 phần.',
    '300 - 499 phần.',
    'Từ 500 phần trở lên.',
    'Không rõ.'] },
  { type: 'radio', title: 'Câu 11: Chi phí trung bình cho một phần quà trong đợt đó khoảng bao nhiêu?',
    help: 'Một phần quà là toàn bộ quà dành cho một người nhận. Tính cả sản phẩm, tùy chỉnh và bao bì; chưa tính vận chuyển.', options: [
    'Dưới 30.000 đồng.',
    'Từ 30.000 đến dưới 50.000 đồng.',
    'Từ 50.000 đến dưới 100.000 đồng.',
    'Từ 100.000 đến dưới 200.000 đồng.',
    'Từ 200.000 đến dưới 300.000 đồng.',
    'Từ 300.000 đến dưới 500.000 đồng.',
    'Từ 500.000 đồng trở lên.',
    'Không nhớ/Không rõ.'] },
  { type: 'radio', title: 'Câu 12: Trong 12 tháng tới, doanh nghiệp Anh/Chị có dự định tặng quà khách hàng không?', options: [
    'Đã có kế hoạch cụ thể.',
    'Có nhu cầu nhưng chưa có kế hoạch cụ thể.',
    'Chỉ cân nhắc nếu có dịp hoặc phương án phù hợp.',
    'Chưa xác định.'] },

  { type: 'page', title: 'PHẦN 3: CÁCH TÌM KIẾM VÀ QUYẾT ĐỊNH MUA' },
  { type: 'check', title: 'Câu 13: Khi tìm nhà cung cấp quà tặng, Anh/Chị thường ưu tiên sử dụng những nguồn nào?', max: 3, other: true, options: [
    'Google, tìm kiếm trên Internet.',
    'Facebook: fanpage, bài đăng hoặc hội nhóm.',
    'TikTok.',
    'Zalo.',
    'YouTube.',
    'Sàn thương mại điện tử.',
    'Người quen/Đối tác/Đồng nghiệp giới thiệu.',
    'Nhà cung cấp đã từng hợp tác.',
    'Nhà cung cấp chủ động liên hệ.',
    'Hội chợ/Triển lãm/Sự kiện kết nối doanh nghiệp.',
    'Chưa biết tìm ở đâu.'] },
  { type: 'check', title: 'Câu 14: Trước khi liên hệ nhà cung cấp, Anh/Chị muốn xem những thông tin nào nhất?', max: 3, other: true, options: [
    'Ảnh/video sản phẩm thực tế.',
    'Mẫu quà phù hợp với ngành nghề hoặc dịp tặng.',
    'Giá tham khảo theo số lượng.',
    'Số lượng đặt tối thiểu.',
    'Khả năng tùy chỉnh logo, màu sắc và hình dáng.',
    'Thời gian thiết kế, sản xuất và giao hàng.',
    'Đơn hàng đã thực hiện/Phản hồi khách hàng.',
    'Thông tin vật liệu, độ bền và cách sử dụng.',
    'Quy trình đặt hàng, thanh toán và xử lý lỗi.'] },
  { type: 'check', title: 'Câu 15: Ba tiêu chí quan trọng nhất khi doanh nghiệp Anh/Chị lựa chọn nhà cung cấp quà tặng là?', max: 3, other: true, options: [
    'Tổng chi phí phù hợp ngân sách.',
    'Sản phẩm có chất lượng ổn định.',
    'Đúng thời hạn cam kết.',
    'Có mẫu phù hợp với hình ảnh thương hiệu.',
    'Có khả năng thiết kế và tùy chỉnh.',
    'Nhận số lượng ít.',
    'Tư vấn rõ ràng, phản hồi nhanh.',
    'Có mẫu thử hoặc cách kiểm tra chất lượng trước khi sản xuất.',
    'Có hóa đơn, hợp đồng và chứng từ theo yêu cầu.',
    'Chính sách thanh toán phù hợp.',
    'Chính sách xử lý sản phẩm lỗi rõ ràng.'] },
  { type: 'radio', title: 'Câu 16: Ai là người thường có quyền phê duyệt cuối cùng đối với việc mua quà tặng trong doanh nghiệp?', other: true, options: [
    'Chủ doanh nghiệp / Ban Giám đốc / Ban điều hành.',
    'Trưởng phòng Hành chính / Nhân sự.',
    'Trưởng phòng Marketing.',
    'Trưởng phòng Mua hàng.',
    'Trưởng bộ phận tổ chức sự kiện.',
    'Tùy theo giá trị đơn hàng.',
    'Không nắm rõ.'] },
  { type: 'radio', title: 'Câu 17: Trong đợt đặt quà gần nhất, doanh nghiệp đã tìm hiểu bao nhiêu nhà cung cấp trước khi quyết định chọn?', options: [
    'Chỉ 1 nhà cung cấp.',
    '2 - 3 nhà cung cấp.',
    'Từ 4 nhà cung cấp trở lên.',
    'Không rõ.'] },
  { type: 'radio', title: 'Câu 18: Anh/Chị muốn liên hệ lần đầu với nhà cung cấp bằng cách nào?', other: true, options: [
    'Nhắn Zalo.',
    'Nhắn Facebook Messenger.',
    'Gọi điện trực tiếp.',
    'Gửi Email.',
    'Điền form yêu cầu tư vấn trên website.',
    'Gặp trực tiếp.'] },
  { type: 'radio', title: 'Câu 19: Thông thường, doanh nghiệp cần bắt đầu tìm và đặt quà trước ngày sử dụng khoảng bao lâu?', options: [
    'Dưới 1 tuần.',
    'Từ 1 đến dưới 2 tuần.',
    'Từ 2 đến dưới 4 tuần.',
    'Từ 4 đến dưới 8 tuần.',
    'Từ 8 tuần trở lên.',
    'Tùy chương trình, chưa xác định được.'] },

  { type: 'page', title: 'PHẦN 4: KHÓ KHĂN VÀ NHU CẦU CHƯA ĐƯỢC ĐÁP ỨNG' },
  { type: 'check', title: 'Câu 20: Những yếu tố nào đang khiến doanh nghiệp khó triển khai hoặc mở rộng việc tặng quà khách hàng?', max: 3, other: true, options: [
    'Ngân sách dành cho quà tặng còn hạn chế.',
    'Số lượng đặt tối thiểu cao hơn nhu cầu.',
    'Chưa có dịp hoặc chương trình phù hợp.',
    'Chưa thấy rõ lợi ích so với các hoạt động marketing khác.',
    'Chưa tìm được món quà phù hợp với khách hàng.',
    'Thiếu người hoặc thời gian phụ trách.',
    'Chưa tìm được nhà cung cấp đáng tin cậy.',
    'Chưa có trở ngại đáng kể.'] },
  { type: 'check', title: 'Câu 21: Khi tìm hiểu hoặc làm việc với nhà cung cấp quà tặng, Anh/Chị đã gặp vấn đề nào?', max: 3, other: true, options: [
    'Giá báo ban đầu chưa thể hiện đầy đủ các khoản phí.',
    'Phí thiết kế/tùy chỉnh cao.',
    'Mẫu ít khác biệt hoặc khó tùy chỉnh.',
    'Khó đánh giá chất lượng trước khi đặt.',
    'Sản phẩm thực tế khác mẫu hoặc chất lượng không đồng đều.',
    'Giao chậm hoặc không nhận đơn có thời hạn gấp.',
    'Tư vấn chậm, trao đổi nhiều lần vẫn chưa rõ.',
    'Chính sách xử lý lỗi chưa phù hợp.',
    'Chưa gặp vấn đề đáng kể.',
    'Chưa từng tìm hiểu hoặc làm việc với nhà cung cấp.'] },
  { type: 'check', title: 'Câu 22: Khía cạnh nào của món quà khiến doanh nghiệp khó đạt mục tiêu nhận diện thương hiệu?', max: 2, other: true, options: [
    'Khách hàng ít sử dụng hoặc không giữ lại quà.',
    'Logo/tên thương hiệu khó nhận ra.',
    'Mẫu quà giống nhiều thương hiệu khác.',
    'Món quà chưa liên quan đến sản phẩm/dịch vụ của doanh nghiệp.',
    'Thiết kế chưa phù hợp hình ảnh thương hiệu.',
    'Chưa có cách theo dõi hiệu quả.',
    'Chưa gặp khó khăn này.',
    'Chưa triển khai nên chưa đánh giá được.'] },
  { type: 'check', title: 'Câu 23: Những hỗ trợ nào sẽ giúp doanh nghiệp dễ triển khai một đơn quà tặng hơn?', max: 3, other: true, options: [
    'Nhận đơn số lượng nhỏ.',
    'Có nhiều lựa chọn theo từng mức ngân sách.',
    'Báo giá rõ tổng chi phí ngay từ đầu.',
    'Tư vấn chọn quà theo khách hàng và mục tiêu chương trình.',
    'Có mẫu sẵn để giảm thời gian và chi phí thiết kế.',
    'Có bản minh họa gắn nhận diện thương hiệu trước khi đặt.',
    'Có thể đặt mẫu thử với chi phí được thông báo rõ.',
    'Công bố rõ thời gian sản xuất và giao hàng.',
    'Có điều khoản thanh toán và xử lý lỗi rõ ràng.'] },
  { type: 'info', title: 'Thông tin tham khảo cho câu 24 đến câu 33',
    help: 'Quà tặng in 3D có thể gồm móc khóa, mascot/nhân vật đại diện thương hiệu, mô hình nhỏ và đồ dùng để bàn. ' +
      'Sản phẩm có thể tùy chỉnh hình dáng, logo, màu sắc và chi tiết tùy thiết kế.\n\n' +
      'Bề mặt sản phẩm có thể thấy vân lớp in. Giá và thời gian sản xuất phụ thuộc vào thiết kế, kích thước, vật liệu, màu sắc và số lượng.' },
  { type: 'check', title: 'Câu 24: Với thông tin trên, Anh/Chị còn băn khoăn điều gì về quà tặng in 3D?', max: 3, other: true, options: [
    'Chưa hình dung rõ sản phẩm thực tế.',
    'Vân lớp in có thể chưa phù hợp kỳ vọng thẩm mỹ.',
    'Chưa rõ độ bền và cách bảo quản.',
    'Chưa rõ vật liệu có phù hợp với mục đích sử dụng không.',
    'Chưa biết có phù hợp hình ảnh thương hiệu không.',
    'Chưa biết khách hàng có muốn sử dụng hoặc giữ lại không.',
    'Lo tổng chi phí vượt ngân sách.',
    'Lo thời gian sản xuất hoặc chất lượng khi đặt nhiều.',
    'Không có băn khoăn đáng kể.'] },
  { type: 'check', title: 'Câu 25: Nếu cần tìm hiểu quà tặng in 3D, nội dung nào sẽ hữu ích nhất với Anh/Chị?', max: 3, other: true, options: [
    'Video cận cảnh sản phẩm và bề mặt thực tế.',
    'Ảnh/video minh họa sản phẩm trong tình huống sử dụng.',
    'Ví dụ biến logo/mascot thành món quà.',
    'Gợi ý quà theo ngân sách và số lượng.',
    'Gợi ý quà theo ngành nghề hoặc dịp tặng.',
    'Video quy trình sản xuất và kiểm tra chất lượng.',
    'So sánh các lựa chọn về công dụng, chi phí và thời gian.',
    'Trường hợp doanh nghiệp đã sử dụng và phản hồi thực tế.'] },

  { type: 'page', title: 'PHẦN 5: KHẢ NĂNG MUA VÀ MONG MUỐN TRONG TƯƠNG LAI' },
  { type: 'radio', title: 'Câu 26: Nếu cân nhắc quà tặng in 3D, thời điểm sớm nhất doanh nghiệp có thể phát sinh nhu cầu là khi nào?', options: [
    'Trong 3 tháng tới.',
    'Từ trên 3 đến 6 tháng tới.',
    'Từ trên 6 đến 12 tháng tới.',
    'Có thể cân nhắc nhưng chưa xác định thời điểm.'] },
  { type: 'radio', title: 'Câu 27: Nhóm sản phẩm in 3D nào doanh nghiệp muốn ưu tiên xem mẫu trước tiên?',
    help: 'Nếu chọn "Mục khác", vui lòng ghi rõ mẫu muốn xem.', other: true, options: [
    'Móc khóa theo logo hoặc hình dáng riêng.',
    'Mascot/Nhân vật đại diện thương hiệu.',
    'Mô hình thu nhỏ sản phẩm hoặc biểu tượng đặc trưng của doanh nghiệp.',
    'Mô hình sưu tầm theo chủ đề chiến dịch.',
    'Đồ dùng nhỏ để bàn: giá đỡ điện thoại, ống cắm bút…',
    'Chưa đủ thông tin để chọn.'] },
  { type: 'radio', title: 'Câu 28: Nếu đặt quà in 3D, doanh nghiệp muốn thể hiện thương hiệu theo cách nào nhất?', options: [
    'Thêm tên/logo lên mẫu có sẵn.',
    'Phối màu mẫu có sẵn theo nhận diện thương hiệu.',
    'Thiết kế hình dáng riêng theo logo, mascot hoặc sản phẩm đặc trưng.',
    'Giữ sản phẩm không có logo, thể hiện thương hiệu trên bao bì/thẻ quà.',
    'Cần được tư vấn trước khi lựa chọn.'] },
  { type: 'radio', title: 'Câu 29: Với đơn quà tặng in 3D đầu tiên, doanh nghiệp có thể cân nhắc đặt khoảng bao nhiêu sản phẩm?', options: [
    'Dưới 30 sản phẩm.',
    '30–49 sản phẩm.',
    '50–99 sản phẩm.',
    '100–299 sản phẩm.',
    'Từ 300 sản phẩm trở lên.',
    'Cần xem mẫu và giá trước khi xác định.'] },
  // Doc ghi "Chọn tối đa 3 đáp án" cho câu này nên giữ nguyên dạng chọn nhiều.
  { type: 'check', title: 'Câu 30: Tổng ngân sách doanh nghiệp có thể cân nhắc cho đơn quà tặng in 3D đầu tiên là bao nhiêu?', max: 3, options: [
    'Dưới 1 triệu đồng.',
    'Từ 1 đến dưới 3 triệu đồng.',
    'Từ 3 đến dưới 5 triệu đồng.',
    'Từ 5 đến dưới 10 triệu đồng.',
    'Từ 10 đến dưới 20 triệu đồng.',
    'Từ 20 triệu đồng trở lên.',
    'Cần xem phương án cụ thể mới xác định được.'] },
  { type: 'radio', title: 'Câu 31: Nếu cần làm mẫu riêng trước khi sản xuất, doanh nghiệp có thể cân nhắc phương án nào dưới đây?', options: [
    'Chỉ xem bản thiết kế minh họa, chưa cần mẫu vật lý.',
    'Trả phí làm mẫu riêng nếu chi phí được thông báo trước.',
    'Trả phí làm mẫu nếu khoản phí được khấu trừ khi đặt đơn hàng.',
    'Chỉ cân nhắc khi được cung cấp mẫu vật lý miễn phí.',
    'Cần biết mức phí cụ thể mới quyết định được.'] },
  { type: 'radio', title: 'Câu 32: Trước khi đặt sản xuất toàn bộ số lượng, doanh nghiệp muốn kiểm tra sản phẩm theo cách nào nhất?', options: [
    'Xem ảnh/video mẫu thực tế.',
    'Xem và cầm mẫu vật lý trước khi quyết định.',
    'Đặt một lô nhỏ để kiểm tra trước khi đặt tiếp.',
    'Duyệt bản thiết kế và thông số, không cần kiểm tra mẫu thực tế.',
    'Chưa xác định.'] },
  { type: 'radio', title: 'Câu 33: Trong 3 tháng tới, bước xa nhất doanh nghiệp có khả năng thực hiện với quà tặng in 3D là gì?', options: [
    'Xem thêm mẫu và thông tin.',
    'Liên hệ tư vấn hoặc yêu cầu báo giá.',
    'Đặt mẫu thử có trả phí nếu điều kiện phù hợp.',
    'Đặt đơn hàng nếu mẫu, giá và điều kiện đáp ứng yêu cầu.',
    'Chưa xác định.'] },
];

function thayCauHoi() {
  const form = FORM_URL ? FormApp.openByUrl(FORM_URL) : FormApp.getActiveForm();

  form.getItems().forEach(function (item) { form.deleteItem(item); });
  form.setTitle(TIEU_DE).setDescription(MO_TA);

  NOI_DUNG.forEach(function (q) {
    if (q.type === 'page') {
      // Phần đầu tiên dùng tiêu đề form, không cần ngắt trang.
      const item = q.first ? form.addSectionHeaderItem() : form.addPageBreakItem();
      item.setTitle(q.title);
      if (q.help) item.setHelpText(q.help);
      return;
    }
    if (q.type === 'info') {
      form.addSectionHeaderItem().setTitle(q.title).setHelpText(q.help);
      return;
    }

    const item = q.type === 'check' ? form.addCheckboxItem() : form.addMultipleChoiceItem();
    item.setTitle(q.title).setRequired(true);

    let help = q.help || '';
    if (q.max) help = ('Chọn tối đa ' + q.max + ' đáp án. ' + help).trim();
    if (help) item.setHelpText(help);

    if (q.ketThucNeuChonCuoi) {
      const last = q.options.length - 1;
      item.setChoices(q.options.map(function (opt, i) {
        return item.createChoice(opt, i === last ? FormApp.PageNavigationType.SUBMIT : FormApp.PageNavigationType.CONTINUE);
      }));
    } else {
      item.setChoiceValues(q.options);
    }

    if (q.other) item.showOtherOption(true);
    if (q.max) {
      item.setValidation(FormApp.createCheckboxValidation()
        .setHelpText('Vui lòng chọn tối đa ' + q.max + ' đáp án.')
        .requireSelectAtMost(q.max)
        .build());
    }
  });

  Logger.log('Đã thay xong ' + form.getItems().length + ' mục trong form: ' + form.getEditUrl());
}
