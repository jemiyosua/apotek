import React, { useState, useEffect } from 'react';
import './pagination.css'; // Your CSS file for pagination styling
import Button from 'react-bootstrap/Button';


function Pagination({ totalItems, itemsPerPage, onPageChange, initialPage = 1, currentPage, handlePageChange, displayedPageNumbers, totalPages}) {
    // const [currentPage, setCurrentPage] = useState(initialPage);
    // const totalPages = Math.ceil(totalItems / itemsPerPage);

    // useEffect(() => {
    //     onPageChange(currentPage);
    // }, [currentPage, onPageChange]);

    return (
        <nav className="pagination-container">
            <ul className="pagination-list">
                {/* Previous Button */}
                <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-link prev-next-link"
                >
                    &larr; Previous
                </button>
                </li>

                {displayedPageNumbers?.map((page, index) => (
                <li
                    key={index} // Using index as key for ellipsis, unique IDs for numbers is better if possible
                    className={`pagination-item ${page === '...' ? 'ellipsis' : ''}
                    ${
                    page === currentPage ? 'active' : ''
                    
                    }`}
                >
                    {page === '...' ?  (
                    <span className="pagination-link ellipsis-text">...</span>
                    ) : (
                    <button
                        onClick={() => handlePageChange(page)}
                        className="pagination-link"
                    >
                        {page}
                    </button>
                    )}
                </li>
                ))}

                <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-link prev-next-link"
                    variant='primary'
                >
                    Next &rarr;
                </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;