import { useLanguage } from "../context/LanguageContext";

const DICTS = {
  en: {
    // Landing page
    hero_title: "SMART COVERAGE, SMOOTH RIDES.",
    hero_subtitle:
      "Get instant coverage, transparent pricing and hassle-free claims — all in one place.",
    get_quote_now: "Get your quotation now!",
    login: "LOG IN",
    signup: "SIGN UP",
    or: "OR",
    email: "Email",
    password: "Password",
    name_as_ic: "Name as IC",
    identification_number: "Identification Number",
    phone_number: "Phone number",
    confirm_password: "Confirm Password",
    terms_accept_text: "I have read, understood and accepted the",
    terms_conditions: "terms and conditions",
    terms_accept_suffix: "of the platform.",
    forgot_password: "Forgot your password?",
    confirmation_instructions: "Didn't receive confirmation instructions?",

    // Features
    secure: "SECURE",
    secure_desc:
      "Your data and policies are protected with enterprise-grade security.",
    fast: "FAST",
    fast_desc:
      "Quick claims and instant coverage so you spend less time waiting.",
    compare: "COMPARE",
    compare_desc:
      "Easily compare plans to find the best value for your car insurance.",

    // Insurance products
    insurance_products: "Insurance Products",
    insurance_products_subtitle:
      "Explore our variety of car insurance products tailored for you.",
    view_all_products: "View All Products",
    basic_insurance: "Basic Insurance",
    basic_insurance_desc: "Covers essential damages",
    comprehensive_insurance: "Comprehensive Insurance",
    comprehensive_insurance_desc: "Covers all damages",
    third_party_insurance: "Third Party, Fire and Theft Insurance",
    third_party_insurance_desc: "Covers third-party liabilities",
    best_seller: "Best Seller",
    top_rated: "Top Rated",

    // Customer reviews
    customer_reviews: "Customer Reviews",
    customer_reviews_subtitle: "See what our customers are saying about us!",
    review_1: "Great service and affordable rates!",
    review_2: "Had a hassle-free experience finding my policy.",
    review_3: "The quotes were quick and easy to understand.",

    // Footer
    about_us: "About Us",
    useful_links: "Useful Links",
    follow_us: "Follow Us",
    faq: "FAQ",
    contact_us: "Contact Us",
    personal_data_protection: "Personal Data Protection Notice",

    // Manual quote steps
    steps_1: "Enter car plate number",
    steps_2: "Vehicle information",
    steps_3: "Additional protection",
    steps_4: "Personal information",
    steps_5: "Estimated car insurance range",
    steps_6: "Finish",
    plate_prompt: "Please enter your car plate number:",
    plate_max_length: "Maximum length: 10 characters exclude space",
    car_plate_number: "Car plate number:",
    car_brand: "Car Brand:",
    car_model: "Car Model:",
    manufactured_year: "Manufactured Year:",
    select_additional_protection: "Select additional protection:",
    windscreen: "Windscreen",
    named_driver: "Named Driver",
    all_driver: "All Driver",
    natural_disaster: "Natural Disaster (Special Perils)",
    strike_riot: "Strike Riot and Civil Commotion",
    personal_accident: "Personal Accident",
    towing: "Towing",
    passengers_coverage: "Passengers coverage",
    name_as_ic_field: "Name as IC:",
    ic: "IC:",
    postcode: "Postcode:",
    ncd: "NCD:",
    check_ncd: "Check NCD",
    estimated_range: "Estimated Car Insurance Range:",
    your_quotation_sent: "Your insurance quotation has been sent to",
    contact_us_help:
      "If you have any questions, please do not hesitate to {contact_us}.",
    back: "Back",
    next: "Next",
    submit: "Submit",
    done: "Done",
    back_to_home: "Back to Home Page",

    // Dashboard
    get_quote_instantly: "Get Your Car Insurance Quote Instantly",
    find_best_coverage:
      "Find the best coverage that fits your need and budget.",
    get_quote: "Get Quote",
    reminder: "Reminder",
    recent_quotes: "Recent Quotes",
    my_car_records: "My Car Records",
    pending: "Pending",
    confirmed: "Confirmed",
    view: "View",
    renew: "Renew",
    insurance_expired: "Insurance Expired",
    insurance_active_until: "Insurance Active Until",
    renew_now: "Renew now to stay covered.",
    pay_before_due: "Please pay before the due date to avoid late charges.",
    reminder_1_text:
      "Toyota Vios 2024, PJH 9196 insurance expires in 30 days (18 September 2025).",
    reminder_2_text:
      "Your next installment of RM350 for Perodua Myvi 2020, ABC 1234 is due on 10 Sept 2025.",
    quote_id: "Quote ID",
    car_plate: "Car Plate",
    amount: "Amount",
    car_model: "Car Model",
    insurance_expired_days: "Insurance Expired in 30 days",
    insurance_active_until: "Insurance Active Until",
    logout_confirmation: "Are you sure you want to log out?",
    log_out: "Log out",

    // Plate validation
    policy_expired: "Policy Expired",
    policy_expiring_soon: "Policy Expiring Soon",
    active_policy_found: "Active Policy Found",
    policy_expired_message:
      "This vehicle's insurance expired on {date}. You can proceed with a new policy.",
    policy_expiring_message:
      "This vehicle has an active policy expiring in {days} days ({date}). Do you want to renew early or transfer ownership?",
    active_policy_message:
      "This vehicle already has an active policy until {date}. Do you want to renew early or transfer ownership?",
    renew_early: "Renew Early",
    transfer_ownership: "Transfer Ownership",
    proceed_anyway: "Proceed Anyway",
    cancel: "Cancel",

    // Chat assistant
    chat_welcome:
      "Hi! I'm CGS Assistant. Ask me anything about updating your car insurance.",
    chat_got_it:
      "Got it. I'll prefill your quote with what I understood and take you to the form.",
    chat_no_answer:
      "I couldn't find an exact answer. You can start a new quote at Get Quotation or go to /manual-quote for the 6-step flow. Would you like quick links?",
    chat_placeholder: "Ask about renewal, NCD, drivers...",
    send: "Send",
  },
  ms: {
    // Landing page
    hero_title: "PERLINDUNGAN PINTAR, PERJALANAN LANCAR.",
    hero_subtitle:
      "Dapatkan perlindungan segera, harga telus dan tuntutan tanpa masalah — semuanya dalam satu tempat.",
    get_quote_now: "Dapatkan sebut harga anda sekarang!",
    login: "LOG MASUK",
    signup: "DAFTAR",
    or: "ATAU",
    email: "E-mel",
    password: "Kata Laluan",
    name_as_ic: "Nama seperti IC",
    identification_number: "Nombor Pengenalan",
    phone_number: "Nombor telefon",
    confirm_password: "Sahkan Kata Laluan",
    terms_accept_text: "Saya telah membaca, memahami dan menerima",
    terms_conditions: "terma dan syarat",
    terms_accept_suffix: "platform.",
    forgot_password: "Lupa kata laluan anda?",
    confirmation_instructions: "Tidak menerima arahan pengesahan?",

    // Features
    secure: "SELAMAT",
    secure_desc:
      "Data dan polisi anda dilindungi dengan keselamatan gred perusahaan.",
    fast: "CEPAT",
    fast_desc:
      "Tuntutan pantas dan perlindungan segera supaya anda menghabiskan masa menunggu yang lebih sedikit.",
    compare: "BANDINGKAN",
    compare_desc:
      "Dengan mudah bandingkan pelan untuk mencari nilai terbaik untuk insurans kereta anda.",

    // Insurance products
    insurance_products: "Produk Insurans",
    insurance_products_subtitle:
      "Terokai pelbagai produk insurans kereta yang disesuaikan untuk anda.",
    view_all_products: "Lihat Semua Produk",
    basic_insurance: "Insurans Asas",
    basic_insurance_desc: "Melindungi kerosakan penting",
    comprehensive_insurance: "Insurans Komprehensif",
    comprehensive_insurance_desc: "Melindungi semua kerosakan",
    third_party_insurance: "Insurans Pihak Ketiga, Kebakaran dan Kecurian",
    third_party_insurance_desc: "Melindungi liabiliti pihak ketiga",
    best_seller: "Jualan Terbaik",
    top_rated: "Penilaian Tertinggi",

    // Customer reviews
    customer_reviews: "Ulasan Pelanggan",
    customer_reviews_subtitle:
      "Lihat apa yang pelanggan kami katakan tentang kami!",
    review_1: "Perkhidmatan hebat dan kadar berpatutan!",
    review_2: "Mengalami pengalaman tanpa masalah mencari polisi saya.",
    review_3: "Sebut harga adalah pantas dan mudah difahami.",

    // Footer
    about_us: "Tentang Kami",
    useful_links: "Pautan Berguna",
    follow_us: "Ikuti Kami",
    faq: "Soalan Lazim",
    contact_us: "Hubungi Kami",
    personal_data_protection: "Notis Perlindungan Data Peribadi",

    // Manual quote steps
    steps_1: "Masukkan nombor plat kereta",
    steps_2: "Maklumat kenderaan",
    steps_3: "Perlindungan tambahan",
    steps_4: "Maklumat peribadi",
    steps_5: "Anggaran harga insurans kereta",
    steps_6: "Selesai",
    plate_prompt: "Sila masukkan nombor plat kereta anda:",
    plate_max_length: "Panjang maksimum: 10 aksara tanpa ruang",
    car_plate_number: "Nombor plat kereta:",
    car_brand: "Jenama Kereta:",
    car_model: "Model Kereta:",
    manufactured_year: "Tahun Dikeluarkan:",
    select_additional_protection: "Pilih perlindungan tambahan:",
    windscreen: "Cermin Depan",
    named_driver: "Pemandu Bernama",
    all_driver: "Semua Pemandu",
    natural_disaster: "Bencana Alam (Bahaya Khas)",
    strike_riot: "Mogok Rusuhan dan Kekacauan Awam",
    personal_accident: "Kemalangan Peribadi",
    towing: "Tunda",
    passengers_coverage: "Perlindungan Penumpang",
    name_as_ic_field: "Nama seperti IC:",
    ic: "IC:",
    postcode: "Poskod:",
    ncd: "NCD:",
    check_ncd: "Semak NCD",
    estimated_range: "Anggaran Julat Insurans Kereta:",
    your_quotation_sent: "Sebut harga insurans anda telah dihantar ke",
    contact_us_help:
      "Jika anda mempunyai sebarang soalan, jangan teragak-agak untuk {contact_us}.",
    back: "Kembali",
    next: "Seterusnya",
    submit: "Hantar",
    done: "Selesai",
    back_to_home: "Kembali ke Halaman Utama",

    // Dashboard
    get_quote_instantly: "Dapatkan Sebut Harga Insurans Kereta Anda Seketika",
    find_best_coverage:
      "Cari perlindungan terbaik yang sesuai dengan keperluan dan bajet anda.",
    get_quote: "Dapatkan Sebut Harga",
    reminder: "Peringatan",
    recent_quotes: "Sebut Harga Terkini",
    my_car_records: "Rekod Kereta Saya",
    pending: "Menunggu",
    confirmed: "Disahkan",
    view: "Lihat",
    renew: "Perbaharui",
    insurance_expired: "Insurans Tamat Tempoh",
    insurance_active_until: "Insurans Aktif Sehingga",
    renew_now: "Perbaharui sekarang untuk kekal dilindungi.",
    pay_before_due:
      "Sila bayar sebelum tarikh tamat tempoh untuk mengelakkan caj lewat.",
    reminder_1_text:
      "Toyota Vios 2024, PJH 9196 insurans akan tamat tempoh dalam 30 hari (18 September 2025).",
    reminder_2_text:
      "Ansuran seterusnya RM350 untuk Perodua Myvi 2020, ABC 1234 perlu dibayar pada 10 Sept 2025.",
    quote_id: "ID Sebut Harga",
    car_plate: "Plat Kereta",
    amount: "Jumlah",
    car_model: "Model Kereta",
    insurance_expired_days: "Insurans Tamat Tempoh dalam 30 hari",
    insurance_active_until: "Insurans Aktif Sehingga",
    logout_confirmation: "Adakah anda pasti mahu log keluar?",
    log_out: "Log keluar",

    // Plate validation
    policy_expired: "Polisi Tamat Tempoh",
    policy_expiring_soon: "Polisi Akan Tamat Tempoh",
    active_policy_found: "Polisi Aktif Ditemui",
    policy_expired_message:
      "Insurans kenderaan ini telah tamat tempoh pada {date}. Anda boleh meneruskan dengan polisi baru.",
    policy_expiring_message:
      "Kenderaan ini mempunyai polisi aktif yang akan tamat tempoh dalam {days} hari ({date}). Adakah anda mahu memperbaharui awal atau memindahkan pemilikan?",
    active_policy_message:
      "Kenderaan ini sudah mempunyai polisi aktif sehingga {date}. Adakah anda mahu memperbaharui awal atau memindahkan pemilikan?",
    renew_early: "Perbaharui Awal",
    transfer_ownership: "Pindahkan Pemilikan",
    proceed_anyway: "Teruskan Juga",
    cancel: "Batal",

    // Chat assistant
    chat_welcome:
      "Hi! Saya Pembantu CGS. Tanya saya apa-apa tentang mengemas kini insurans kereta anda.",
    chat_got_it:
      "Baik. Saya akan mengisi sebut harga anda dengan apa yang saya fahami dan membawa anda ke borang.",
    chat_no_answer:
      "Saya tidak dapat mencari jawapan yang tepat. Anda boleh memulakan sebut harga baru di Dapatkan Sebut Harga atau pergi ke /manual-quote untuk aliran 6 langkah. Adakah anda mahu pautan pantas?",
    chat_placeholder: "Tanya tentang pembaharuan, NCD, pemandu...",
    send: "Hantar",
  },
  zh: {
    // Landing page
    hero_title: "智能保障，畅享出行。",
    hero_subtitle: "即时保障，透明定价，无忧理赔——一站式服务。",
    get_quote_now: "立即获取报价！",
    login: "登录",
    signup: "注册",
    or: "或",
    email: "邮箱",
    password: "密码",
    name_as_ic: "身份证姓名",
    identification_number: "身份证号码",
    phone_number: "电话号码",
    confirm_password: "确认密码",
    terms_accept_text: "我已阅读、理解并接受平台的",
    terms_conditions: "条款和条件",
    terms_accept_suffix: "",
    forgot_password: "忘记密码？",
    confirmation_instructions: "未收到确认说明？",

    // Features
    secure: "安全",
    secure_desc: "您的数据和保单受到企业级安全保护。",
    fast: "快速",
    fast_desc: "快速理赔和即时保障，减少等待时间。",
    compare: "比较",
    compare_desc: "轻松比较计划，找到最适合您车险的最佳价值。",

    // Insurance products
    insurance_products: "保险产品",
    insurance_products_subtitle: "探索我们为您量身定制的各种车险产品。",
    view_all_products: "查看所有产品",
    basic_insurance: "基础保险",
    basic_insurance_desc: "覆盖基本损失",
    comprehensive_insurance: "综合保险",
    comprehensive_insurance_desc: "覆盖所有损失",
    third_party_insurance: "第三方、火灾和盗窃保险",
    third_party_insurance_desc: "覆盖第三方责任",
    best_seller: "热销",
    top_rated: "高评分",

    // Customer reviews
    customer_reviews: "客户评价",
    customer_reviews_subtitle: "看看我们的客户怎么说！",
    review_1: "服务很棒，价格实惠！",
    review_2: "寻找保单的过程很顺利。",
    review_3: "报价快速且易于理解。",

    // Footer
    about_us: "关于我们",
    useful_links: "有用链接",
    follow_us: "关注我们",
    faq: "常见问题",
    contact_us: "联系我们",
    personal_data_protection: "个人数据保护通知",

    // Manual quote steps
    steps_1: "输入车牌号",
    steps_2: "车辆信息",
    steps_3: "附加保障",
    steps_4: "个人信息",
    steps_5: "车险预估范围",
    steps_6: "完成",
    plate_prompt: "请输入您的车牌号：",
    plate_max_length: "最多 10 个字符，不包括空格",
    car_plate_number: "车牌号：",
    car_brand: "品牌：",
    car_model: "车型：",
    manufactured_year: "出厂年份：",
    select_additional_protection: "选择附加保障：",
    windscreen: "挡风玻璃",
    named_driver: "指定驾驶员",
    all_driver: "所有驾驶员",
    natural_disaster: "自然灾害（特殊风险）",
    strike_riot: "罢工暴动和民变",
    personal_accident: "个人意外",
    towing: "拖车",
    passengers_coverage: "乘客保障",
    name_as_ic_field: "身份证姓名：",
    ic: "身份证：",
    postcode: "邮编：",
    ncd: "无索赔折扣：",
    check_ncd: "检查无索赔折扣",
    estimated_range: "预估车险范围：",
    your_quotation_sent: "您的保险报价已发送至",
    contact_us_help: "如有任何问题，请随时{contact_us}。",
    back: "返回",
    next: "下一步",
    submit: "提交",
    done: "完成",
    back_to_home: "返回主页",

    // Dashboard
    get_quote_instantly: "立即获取车险报价",
    find_best_coverage: "找到最适合您需求和预算的保障。",
    get_quote: "获取报价",
    reminder: "提醒",
    recent_quotes: "最近报价",
    my_car_records: "我的车辆记录",
    pending: "待处理",
    confirmed: "已确认",
    view: "查看",
    renew: "续保",
    insurance_expired: "保险已过期",
    insurance_active_until: "保险有效期至",
    renew_now: "立即续保以保持保障。",
    pay_before_due: "请在到期日前付款以避免滞纳金。",
    reminder_1_text:
      "丰田威驰2024，PJH 9196保险将在30天内到期（2025年9月18日）。",
    reminder_2_text:
      "您的Perodua Myvi 2020，ABC 1234下一期分期付款RM350将于2025年9月10日到期。",
    quote_id: "报价ID",
    car_plate: "车牌号",
    amount: "金额",
    car_model: "车型",
    insurance_expired_days: "保险30天内到期",
    insurance_active_until: "保险有效期至",
    logout_confirmation: "您确定要注销吗？",
    log_out: "注销",

    // Plate validation
    policy_expired: "保单已过期",
    policy_expiring_soon: "保单即将过期",
    active_policy_found: "发现有效保单",
    policy_expired_message:
      "此车辆的保险已于{date}过期。您可以继续购买新保单。",
    policy_expiring_message:
      "此车辆有有效保单将在{days}天后过期（{date}）。您要提前续保还是转移所有权？",
    active_policy_message:
      "此车辆已有有效保单至{date}。您要提前续保还是转移所有权？",
    renew_early: "提前续保",
    transfer_ownership: "转移所有权",
    proceed_anyway: "继续",
    cancel: "取消",

    // Chat assistant
    chat_welcome: "您好！我是CGS助手。您可以询问任何关于更新车险的问题。",
    chat_got_it: "好的。我将根据理解的信息预填您的报价并带您到表单。",
    chat_no_answer:
      "我找不到确切的答案。您可以在获取报价处开始新报价，或前往/manual-quote进行6步流程。您需要快速链接吗？",
    chat_placeholder: "询问续保、无索赔折扣、驾驶员...",
    send: "发送",
  },
};

export function useT() {
  const { language } = useLanguage();
  const dict = DICTS[language] || DICTS.en;
  return (key, fallback) => dict[key] ?? fallback ?? key;
}

export function translateWithPlaceholders(t, key, placeholders = {}) {
  let str = t(key);
  Object.entries(placeholders).forEach(([k, v]) => {
    str = str.replace(`{${k}}`, v);
  });
  return str;
}
