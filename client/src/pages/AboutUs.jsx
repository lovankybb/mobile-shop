import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  Settings,
} from "lucide-react";
import shopImg from "../assets/shop.jpg";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
            Về <span className="text-blue-600">Bảo Bình Mobile</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Điểm đến tin cậy cho mua bán, trao đổi, sửa chữa các sản phẩm công
            nghệ uy tín hàng đầu Việt Nam.
          </p>
        </div>

        {/* Who we are */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-blue-50 md:w-1/3 flex items-center justify-center p-8">
              <img src={shopImg} alt="Shop" className="rounded-3xl" />
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Chúng tôi là ai?
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                <strong className="font-seminbold text-blue-600">Bảo Bình Mobile: </strong>Chuyên phân phối các dòng
                smartphone từ các thương hiệu lớn như Apple, Samsung, Xiaomi,
                Oppo... từ máy mới đập hộp{" "}
                <span className="font-semibold text-blue-600">(New)</span> đến
                máy lướt đẹp như mới (99%), cam kết nguyên bản, rõ ràng nguồn
                gốc và có chế độ bảo hành dài hạn.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Ngoài ra, chúng tôi còn cung cấp dịch vụ sửa chữa, bảo hành uy
                tín với đội ngũ kỹ thuật viên giàu kinh nghiệm, sử dụng linh
                kiện chính hãng.
              </p>
              <p className="text-gray-600 leading-relaxed">
                {" "}
                <strong className="font-seminbold text-blue-600">
                  Bảo Bình Mobile
                </strong>{" "}
                luôn nỗ lực mang đến trải nghiệm mua sắm và dịch vụ hậu mãi tốt
                nhất cho khách hàng trên toàn quốc.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={32} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Chính hãng 100%
            </h3>
            <p className="text-gray-500">
              Cam kết nguồn gốc xuất xứ rõ ràng, bảo hành chính hãng toàn quốc.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Settings size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Sửa chữa chuyên nghiệp
            </h3>
            <p className="text-gray-500">
              Dịch vụ sửa chữa, bảo hành uy tín với linh kiện chính hãng.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <HeadphonesIcon size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Hỗ trợ tận tâm
            </h3>
            <p className="text-gray-500">
              Đội ngũ CSKH hoạt động 24/7 sẵn sàng giải đáp mọi thắc mắc của
              bạn.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden text-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 space-y-8">
              <h2 className="text-3xl font-bold">Thông tin liên hệ & Hỗ trợ</h2>
              <p className="text-gray-300">
                Bạn cần hỗ trợ bảo hành, tư vấn mua hàng hay giải đáp thắc mắc?
                Đừng ngần ngại liên hệ với Bảo Bình Mobile qua các kênh sau:
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin
                    className="text-blue-400 mt-1 mr-4 shrink-0"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold text-lg">Địa chỉ</h4>
                    <p className="text-gray-400 mt-1">
                      KCN Đại An mở rộng, phường Tứ Minh, TP. Hải Phòng
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone
                    className="text-green-400 mt-1 mr-4 shrink-0"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      Liên hệ hỗ trợ qua điện thoại
                    </h4>
                    <p className="text-gray-400 mt-1">CSKH: 0945.227.129</p>
                    <p className="text-gray-400">Kỹ thuật: 0896.56.9696</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail
                    className="text-purple-400 mt-1 mr-4 shrink-0"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold text-lg">Email liên hệ</h4>
                    <p className="text-gray-400 mt-1">
                      baobinhmobile.shop@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock
                    className="text-yellow-400 mt-1 mr-4 shrink-0"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold text-lg">Giờ hoạt động</h4>
                    <p className="text-gray-400 mt-1">
                      Thứ 2 - Chủ nhật: 08:00 - 22:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed or Image PlaceHolder */}
            <div className="relative h-64 md:h-full min-h-[300px] bg-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.9033820344066!2d106.24741567597493!3d20.916206491633442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31359900008c2685%3A0x9a264769c3513bbb!2zQuG6ok8gQsOMTkggTW9iaWxl!5e0!3m2!1svi!2sus!4v1780704299070!5m2!1svi!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Bảo Bình Mobile Location"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
