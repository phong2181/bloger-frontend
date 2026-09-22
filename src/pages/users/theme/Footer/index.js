import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
    FaFacebook, 
    FaYoutube,
    FaTiktok,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";
import { useGetPublicFooter } from "api/homePage";
import "./style.scss";

// Giá trị mặc định khi chưa có data từ database
const DEFAULT_FOOTER = {
    brand: {
        desc: "Nền tảng nghe truyện audio chất lượng cao. Đem lại những giây phút thư giãn tuyệt vời cho thính giả mọi lúc mọi nơi.",
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
        tiktok: "https://tiktok.com"
    },
    links: [
        { id: 1, label: "Trang chủ", url: "/" },
        { id: 2, label: "Danh sách truyện", url: "/truyen" },
        { id: 3, label: "Bài viết", url: "/bai-viet" }
    ],
    slides: [
        { id: 1, imageUrl: "https://picsum.photos/400/250?random=1", title: "Thế giới Audio phong phú" },
        { id: 2, imageUrl: "https://picsum.photos/400/250?random=2", title: "Cộng đồng nghe truyện văn minh" },
        { id: 3, imageUrl: "https://picsum.photos/400/250?random=3", title: "Cập nhật chương mới mỗi ngày" },
        { id: 4, imageUrl: "https://picsum.photos/400/250?random=4", title: "Trải nghiệm âm thanh sống động" }
    ]
};

const Footer = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    const { data: footerResponse } = useGetPublicFooter();

    const footerData = footerResponse?.data || DEFAULT_FOOTER;
    const brand = footerData.brand || DEFAULT_FOOTER.brand;
    const links = footerData.links?.length > 0 ? footerData.links : DEFAULT_FOOTER.links;
    const slides = footerData.slides?.length > 0 ? footerData.slides : DEFAULT_FOOTER.slides;

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        if (slides.length === 0) return;

        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === slides.length - 1 ? 0 : prevIndex + 1
                ),
            3000
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex, slides.length]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <footer className="site-footer">
            <div className="footer-container">
                {/* Cột 1: Thông tin thương hiệu */}
                <div className="footer-col brand-col">
                    <div className="footer-logo">
                        <div className="logo-icon">
                            <img src={process.env.PUBLIC_URL + "/logoaudio.ico"} alt="BookAudio Logo" className="footer-brand-img" />
                        </div>
                        <span className="logo-text">Audio <span className="logo-sub">Sotry</span></span>
                    </div>
                    <p className="footer-desc">
                        {brand.desc || DEFAULT_FOOTER.brand.desc}
                    </p>
                    <div className="social-links">
                        {brand.facebook && (
                            <a href={brand.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                        )}
                        {brand.youtube && (
                            <a href={brand.youtube} target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                                <FaYoutube />
                            </a>
                        )}
                        {brand.tiktok && (
                            <a href={brand.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                <FaTiktok />
                            </a>
                        )}
                    </div>
                </div>

                {/* Cột 2: Danh mục điều hướng */}
                <div className="footer-col links-col">
                    <h3>Menu</h3>
                    <ul className="footer-links">
                        {links.map(link => (
                            <li key={link.id}>
                                {link.url?.startsWith("http") ? (
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                                ) : (
                                    <Link to={link.url}>{link.label}</Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột 3: Slider trình chiếu ảnh tự động */}
                <div className="footer-col slider-col">
                    <h3>Khám phá BlogerAudio</h3>
                    {slides.length > 0 && (
                        <div className="footer-slider-wrapper">
                            <div className="footer-slider">
                                <div 
                                    className="slider-track" 
                                    style={{ transform: `translateX(${-currentIndex * 100}%)` }}
                                >
                                    {slides.map((img) => (
                                        <div className="slide-item" key={img.id}>
                                            <img src={img.imageUrl} alt={img.title} />
                                            <div className="slide-caption">{img.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="slider-btn btn-prev" onClick={handlePrev} aria-label="Slide trước">
                                <FaChevronLeft size={12} />
                            </button>
                            <button className="slider-btn btn-next" onClick={handleNext} aria-label="Slide tiếp theo">
                                <FaChevronRight size={12} />
                            </button>

                            <div className="slider-dots">
                                {slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`dot ${currentIndex === idx ? "active" : ""}`}
                                        onClick={() => setCurrentIndex(idx)}
                                        aria-label={`Đi tới slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} BlogerAudio. Designed & Developed with ❤️ by Phong Nguyễn.</p>
            </div>
        </footer>
    );
};

export default Footer;