# AI Sales Radar --- MVP Requirements & UI Specification

> **Tài liệu yêu cầu cho AI coding agent (Codex / Antigravity /
> Cursor)**\
> Phiên bản: 1.0\
> Trạng thái: Ready for initial implementation\
> Phạm vi: Chỉ xây dựng **Dashboard** và **Sales Feed**; chưa triển khai
> crawling, backend riêng hoặc AI processing.

------------------------------------------------------------------------

## 1. Tổng quan dự án

### 1.1. Mục tiêu

Xây dựng một website dashboard tập trung để hiển thị và theo dõi các bài
đăng bán hàng (sales posts) được lưu trong Supabase.

Trong giai đoạn MVP, website chỉ đọc dữ liệu từ Supabase và hiển thị cho
người dùng. Dữ liệu có thể được thêm thủ công hoặc nạp sẵn vào Supabase.
Chưa xây dựng hệ thống tự động thu thập dữ liệu từ Facebook, TikTok hay
website khác.

### 1.2. Mục tiêu trải nghiệm

Người dùng cần có khả năng:

-   Nắm bắt nhanh số lượng và tình hình bài đăng mới.
-   Xem các bài đăng bán hàng tập trung tại một nơi.
-   Tìm kiếm và lọc bài đăng.
-   Xem thông tin sản phẩm, giá, nền tảng, người đăng, thời gian và
    đường dẫn bài gốc.
-   Lưu bài đăng quan trọng vào Favorites.
-   Chuyển đổi giữa Card View và Compact List View.

### 1.3. Nguyên tắc

1.  **Information first:** Ưu tiên thông tin sản phẩm, giá, thời gian và
    nguồn.
2.  **Fast and simple:** Giao diện nhanh, dễ đọc, không có chức năng
    thừa.
3.  **Data-driven:** Mọi số liệu trên Dashboard phải lấy từ dữ liệu thực
    tế trong Supabase.
4.  **Future-ready:** Cấu trúc code và database có thể mở rộng để tích
    hợp AI/crawling sau này, nhưng không triển khai các phần đó trong
    MVP.
5.  **No fabricated data:** Không tự suy đoán hoặc tạo thông tin sản
    phẩm, giá, địa điểm hay AI summary khi dữ liệu không có.

------------------------------------------------------------------------

## 2. Phạm vi MVP

### 2.1. Bao gồm

-   React + Vite frontend.
-   Supabase Free làm database và dịch vụ truy cập dữ liệu.
-   Kết nối trực tiếp từ frontend tới Supabase bằng
    `@supabase/supabase-js`.
-   Dashboard.
-   Sales Feed.
-   Search và filters.
-   Card View và Compact List View.
-   Favorites cơ bản.
-   Loading, empty, error và retry states.
-   Mock data để phát triển giao diện trước khi kết nối database.
-   Responsive layout cho desktop, tablet và mobile.

### 2.2. Không bao gồm trong MVP

Không tự ý triển khai các chức năng sau:

-   Facebook/TikTok crawling hoặc scraping.
-   AI agent truy cập mạng xã hội.
-   Backend riêng bằng FastAPI, Express hoặc server khác.
-   AI extraction, AI summary, AI scoring hoặc trend detection.
-   Chatbot AI.
-   Notifications/email/Telegram.
-   Analytics nâng cao.
-   Đăng nhập mạng xã hội.
-   Tải video hoặc hình ảnh từ bài đăng bên thứ ba.
-   Tự động đồng bộ dữ liệu theo lịch.

Nếu cần dữ liệu để demo, sử dụng mock data hoặc dữ liệu được người dùng
cung cấp/được phép sử dụng.

------------------------------------------------------------------------

## 3. Công nghệ và kiến trúc

### 3.1. Tech stack

  Layer             Công nghệ
  ----------------- ------------------------------------
  Frontend          React + Vite
  Language          JavaScript (JSX)
  Styling           Tailwind CSS
  UI components     shadcn/ui (nếu phù hợp với setup)
  Icons             Lucide React
  Routing           React Router
  Database          Supabase PostgreSQL --- Free plan
  Data access       `@supabase/supabase-js`
  Charts            Recharts hoặc thư viện tương thích
  Date formatting   date-fns hoặc Intl API

Không cần cài đặt backend riêng.

### 3.2. Kiến trúc dữ liệu

``` text
Browser
  |
  v
React + Vite
  |
  +-- Pages / Components
  |
  +-- Hooks
  |
  +-- Services
  |     |
  |     v
  |   Supabase JS Client
  |
  v
Supabase API
  |
  v
PostgreSQL Database
```

### 3.3. Quy tắc kiến trúc

-   Components chỉ tập trung vào UI và tương tác.
-   Các truy vấn Supabase phải đặt trong `services/`, không viết trực
    tiếp rải rác trong component.
-   Custom hooks quản lý việc tải dữ liệu và trạng thái giao diện.
-   Không hardcode dữ liệu nghiệp vụ trong UI khi đã có dữ liệu
    Supabase.
-   Mock data phải tách riêng để có thể chuyển sang dữ liệu thật dễ
    dàng.
-   Không tạo API server riêng trong MVP.
-   Không đưa Supabase Secret Key hoặc `service_role` key vào frontend.
-   Chỉ sử dụng Supabase Publishable Key (hoặc legacy anon key) ở
    frontend, kết hợp RLS policies phù hợp.

------------------------------------------------------------------------

## 4. Cấu trúc thư mục đề xuất

``` text
sales-radar/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── PageHeader.jsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx
│   │   │   ├── PostsByPlatformChart.jsx
│   │   │   ├── PostsByCategoryChart.jsx
│   │   │   └── RecentPosts.jsx
│   │   ├── sales/
│   │   │   ├── SalesCard.jsx
│   │   │   ├── SalesListRow.jsx
│   │   │   ├── SalesFilters.jsx
│   │   │   ├── SalesSearch.jsx
│   │   │   ├── ViewToggle.jsx
│   │   │   └── SalesPagination.jsx
│   │   └── common/
│   │       ├── LoadingState.jsx
│   │       ├── ErrorState.jsx
│   │       ├── EmptyState.jsx
│   │       └── PlatformBadge.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   └── SalesFeedPage.jsx
│   ├── services/
│   │   ├── supabaseClient.js
│   │   ├── salesService.js
│   │   ├── dashboardService.js
│   │   └── favoritesService.js
│   ├── hooks/
│   │   ├── useSalesPosts.js
│   │   ├── useDashboardStats.js
│   │   └── useFavorites.js
│   ├── mocks/
│   │   └── salesPosts.js
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

AI coding agent có thể điều chỉnh cấu trúc nếu có lý do kỹ thuật rõ
ràng, nhưng phải giữ nguyên nguyên tắc tách UI, hooks, services và mock
data.

------------------------------------------------------------------------

## 5. UI/UX Design System

### 5.1. Phong cách

Thiết kế theo phong cách **Modern SaaS Dashboard**:

-   Sạch sẽ, chuyên nghiệp, hiện đại.
-   Ưu tiên desktop vì người dùng cần quan sát nhiều dữ liệu.
-   Nền sáng là mặc định.
-   Sidebar màu navy/dark hoặc neutral.
-   Nội dung chính nền trắng/xám rất nhạt.
-   Card có border nhẹ, radius vừa phải và shadow rất nhẹ.
-   Không lạm dụng gradient, màu nổi hoặc animation.
-   Typography rõ ràng, phân cấp tốt.
-   Thông tin giá bán phải dễ nhìn.
-   Không thiết kế giống giao diện Facebook/TikTok.

### 5.2. Màu sắc tham khảo

  Vai trò           Màu
  ----------------- -----------
  App background    `#F5F7FA`
  Card background   `#FFFFFF`
  Sidebar           `#172033`
  Primary           `#2563EB`
  Success           `#16A34A`
  Text primary      `#172033`
  Text secondary    `#64748B`
  Border            `#E2E8F0`

Có thể điều chỉnh màu để đảm bảo độ tương phản và tính nhất quán.

### 5.3. Layout tổng thể

Desktop:

``` text
+-------------------+------------------------------------------+
|                   | Header                                   |
|                   | Search / Page actions                    |
|     Sidebar       +------------------------------------------+
|                   |                                          |
|  Dashboard        |              Main Content                |
|  Sales Feed       |                                          |
|                   |                                          |
|                   |                                          |
|                   |                                          |
+-------------------+------------------------------------------+
```

-   Sidebar cố định ở desktop.
-   Header nằm trên vùng nội dung.
-   Main content có max-width hợp lý hoặc sử dụng toàn bộ không gian
    desktop.
-   Mobile sidebar chuyển thành drawer hoặc navigation phù hợp.
-   Không để nội dung bị tràn ngang ở màn hình nhỏ.

### 5.4. Sidebar

Logo/tên sản phẩm: **Sales Radar**

Menu MVP:

-   Dashboard
-   Sales Feed

Các mục chưa triển khai (Analytics, AI Assistant, Sources, Settings...)
không cần xuất hiện trong navigation MVP. Không tạo trang placeholder
không có chức năng.

Sidebar cần thể hiện rõ trang đang được chọn.

### 5.5. Header

-   Tên trang hoặc breadcrumb.
-   Search nhanh (nếu không gây trùng lặp với search chính của Sales
    Feed).
-   Có thể có nút refresh dữ liệu.
-   Avatar/profile chỉ hiển thị nếu đã có authentication; không tạo chức
    năng giả.

------------------------------------------------------------------------

## 6. Page 1 --- Dashboard

### 6.1. Mục tiêu

Dashboard cung cấp cái nhìn tổng quan nhanh về dữ liệu sales posts đang
có trong Supabase.

### 6.2. Thành phần giao diện

#### A. Page header

-   Title: `Dashboard`
-   Subtitle: `Overview of your collected sales posts`
-   Nút refresh để tải lại dữ liệu.

#### B. KPI cards

Hiển thị các chỉ số:

1.  **Total Posts:** Tổng số bài đăng.
2.  **Posts Today:** Số bài đăng có `published_at` trong ngày hiện tại.
3.  **Posts This Week:** Số bài đăng trong tuần hiện tại.
4.  **Favorites:** Tổng số bài đã được lưu.

Yêu cầu:

-   Mỗi card có title, số liệu và icon phù hợp.
-   Có thể hiển thị mô tả nhỏ.
-   Không tự tạo phần trăm tăng trưởng nếu chưa có dữ liệu kỳ trước để
    so sánh.
-   Nếu chưa có dữ liệu, hiển thị 0 hoặc empty state hợp lý.
-   Thống nhất timezone khi tính Today/This Week. Mặc định dùng timezone
    trình duyệt hoặc cấu hình rõ ràng; tránh trộn timezone.

#### C. Posts by Platform

Biểu đồ thể hiện số lượng bài đăng theo nền tảng, ví dụ:

-   Facebook
-   TikTok
-   Instagram
-   Other

Chỉ hiển thị nền tảng có dữ liệu. Không hardcode số lượng.

#### D. Posts by Category

Biểu đồ thể hiện số bài đăng theo category.

-   Dùng dữ liệu category thực tế.
-   Có thể hiển thị top categories.
-   Các bài không có category phải được xử lý trong nhóm `Uncategorized`
    nếu phù hợp.

#### E. Recent Sales Posts

Hiển thị khoảng 5--10 bài đăng mới nhất.

Mỗi dòng/card gồm:

-   Thumbnail nếu có.
-   Product name hoặc tiêu đề rút gọn.
-   Platform.
-   Price nếu có.
-   Published date.
-   Link hoặc thao tác mở chi tiết Sales Feed.

Nút `View all` điều hướng đến Sales Feed.

### 6.3. Dashboard behavior

-   Tất cả KPI và chart phải lấy từ Supabase.
-   Dùng query tổng hợp phù hợp; tránh tải toàn bộ hàng nghìn posts về
    browser chỉ để tính số liệu.
-   Nếu chưa có dữ liệu, hiển thị empty state hướng dẫn thêm dữ liệu vào
    Supabase.
-   Có loading state dạng skeleton.
-   Có error state và nút retry.
-   Nút refresh phải thực sự tải lại dữ liệu.

------------------------------------------------------------------------

## 7. Page 2 --- Sales Feed

### 7.1. Mục tiêu

Đây là trang trọng tâm của MVP. Người dùng cần xem được nhiều bài đăng,
nhanh chóng tìm ra sản phẩm và thông tin quan trọng.

### 7.2. Page header

-   Title: `Sales Feed`
-   Subtitle: `Browse and manage sales posts from all sources`
-   Hiển thị tổng số kết quả phù hợp với bộ lọc hiện tại.
-   Có nút refresh.

### 7.3. Search

Search cần hỗ trợ tìm theo các trường phù hợp:

-   Product name.
-   Post content.
-   Author name.
-   Location.

Yêu cầu:

-   Search input có placeholder rõ ràng:
    `Search products, posts, sellers, locations...`
-   Có nút clear.
-   Có debounce khoảng 300--500 ms nếu search được gọi liên tục.
-   Search phải kết hợp được với các filters.
-   Không phân biệt chữ hoa/chữ thường nếu khả năng truy vấn hỗ trợ.
-   Không tải toàn bộ database về frontend để search.

### 7.4. Filters

Các bộ lọc MVP:

  -----------------------------------------------------------------------
  Filter                              Giá trị
  ----------------------------------- -----------------------------------
  Platform                            All, Facebook, TikTok, Instagram,
                                      Other

  Category                            All và các category trong database

  Price range                         Min price, Max price

  Date                                All time, Today, Last 7 days, Last
                                      30 days

  Condition                           All, New, Used, Refurbished

  Sort                                Newest first, Oldest first, Price
                                      low to high, Price high to low
  -----------------------------------------------------------------------

Yêu cầu:

-   Có nút `Clear filters`.
-   Filter có thể sử dụng đồng thời.
-   Khi filter thay đổi, kết quả và tổng số kết quả phải cập nhật.
-   Giá trị không xác định phải được xử lý rõ ràng, không xem là giá 0.
-   Có thể bổ sung Location filter sau nếu dữ liệu location đã đủ nhất
    quán.

### 7.5. Card View

Mặc định ưu tiên Card View.

Mỗi card nên hiển thị:

1.  Platform badge.
2.  Author name.
3.  Published time.
4.  Product image/thumbnail (nếu có).
5.  Product name.
6.  Price và currency (nếu có).
7.  Location (nếu có).
8.  Post content rút gọn.
9.  AI Summary chỉ hiển thị nếu database có giá trị; nếu không thì ẩn,
    không tạo nội dung giả.
10. Category/condition tags nếu có.
11. Favorite button.
12. `View Original Post` button/link.

Thiết kế card:

``` text
+------------------------------------------------------+
| [Facebook]  Seller name             2 hours ago   ☆  |
|                                                      |
| [Product image]  Product name                        |
|                  $250                                 |
|                  Oklahoma City                       |
|                                                      |
| Post content preview, maximum 2–3 lines...           |
|                                                      |
| [Electronics] [Used]                                 |
|                                                      |
| [View Original Post]                                 |
+------------------------------------------------------+
```

Quy tắc:

-   Giá phải nổi bật nhưng không quá lớn.
-   Nếu không có giá, hiển thị `Price not listed`.
-   Nếu không có ảnh, hiển thị placeholder đẹp và nhất quán.
-   Nội dung dài phải truncate, không làm card có chiều cao bất thường.
-   Link bài gốc mở tab mới với `rel="noopener noreferrer"`.
-   Không giả lập ảnh/video từ nền tảng khi không có URL media hợp lệ.

### 7.6. Compact List View

Cho phép đổi sang dạng danh sách để xem nhiều bài hơn.

Các cột gợi ý:

-   Product / Post.
-   Platform.
-   Price.
-   Location.
-   Condition.
-   Published date.
-   Favorite.
-   Original link.

Yêu cầu:

-   Có thể sort theo các trường được hỗ trợ.
-   Trên mobile, chuyển thành list cards hoặc layout cuộn hợp lý.
-   Không làm bảng quá rộng gây khó sử dụng.

### 7.7. Pagination

-   Sử dụng server-side pagination thông qua Supabase query.
-   Mặc định 20 bài/trang.
-   Cho phép chọn 20 / 50 / 100 nếu phù hợp.
-   Hiển thị current page và total results.
-   Khi search/filter/sort thay đổi, reset về trang đầu.
-   Ưu tiên range query của Supabase.
-   Không tải toàn bộ posts cùng lúc.

### 7.8. Favorites

Trong MVP có thể hỗ trợ Favorites cơ bản.

Nếu chưa có authentication:

-   Có thể dùng localStorage cho bản demo cá nhân, nhưng phải ghi rõ đây
    là favorites trên trình duyệt hiện tại.
-   Nếu muốn lưu Favorites lâu dài trong Supabase và hỗ trợ nhiều thiết
    bị/người dùng, cần triển khai Supabase Auth và RLS.
-   Không tạo bảng favorites có quyền đọc/ghi công khai mà không có
    chính sách bảo mật phù hợp.

Nút Favorite cần có trạng thái selected/unselected rõ ràng.

### 7.9. Sales Feed states

Phải có đầy đủ:

-   Loading: skeleton cards/rows.
-   Empty: không có bài đăng.
-   No search results: không có kết quả phù hợp với điều kiện tìm kiếm.
-   Error: không lấy được dữ liệu từ Supabase.
-   Retry: cho phép thử tải lại.
-   Missing fields: hiển thị fallback cho giá, ảnh, location, condition.

------------------------------------------------------------------------

## 8. Supabase Database Schema

### 8.1. Bảng `sources`

  Column       Type          Notes
  ------------ ------------- ------------------------------------
  id           uuid          Primary key
  name         text          Tên nguồn
  platform     text          facebook, tiktok, instagram, other
  source_url   text          URL nguồn, nullable
  is_active    boolean       Default true
  created_at   timestamptz   Default now()

### 8.2. Bảng `categories`

  Column       Type          Notes
  ------------ ------------- ---------------
  id           uuid          Primary key
  name         text          Tên category
  slug         text          Unique
  created_at   timestamptz   Default now()

### 8.3. Bảng `sales_posts`

  Column             Type            Notes
  ------------------ --------------- --------------------------------------
  id                 uuid            Primary key
  source_id          uuid            FK to sources.id, nullable
  external_post_id   text            ID bài gốc, nullable
  original_url       text            Link bài gốc
  author_name        text            Tên người đăng
  content            text            Nội dung bài đăng
  image_url          text            URL ảnh được phép hiển thị, nullable
  product_name       text            Tên sản phẩm, nullable
  category_id        uuid            FK to categories.id, nullable
  price              numeric(12,2)   Giá, nullable
  currency           text            Default USD
  location           text            Địa điểm, nullable
  condition          text            new, used, refurbished, unknown
  published_at       timestamptz     Thời gian đăng
  created_at         timestamptz     Default now()
  updated_at         timestamptz     Default now()

Có thể bổ sung các cột `ai_summary`, `ai_confidence`,
`duplicate_group_id` ở giai đoạn sau. Không cần triển khai AI ở MVP.

### 8.4. Bảng `favorites`

Chỉ triển khai theo một trong hai hướng:

**Option A --- Demo một người dùng:** Dùng localStorage, chưa cần bảng
Supabase.

**Option B --- Favorites đồng bộ:** Dùng Supabase Auth và bảng:

  Column       Type
  ------------ -------------
  id           uuid
  user_id      uuid
  post_id      uuid
  created_at   timestamptz

Tạo unique constraint cho `(user_id, post_id)` và RLS để mỗi user chỉ
xem/sửa favorites của chính mình.

### 8.5. Indexes đề xuất

-   `sales_posts.published_at`
-   `sales_posts.source_id`
-   `sales_posts.category_id`
-   `sales_posts.price`
-   `sales_posts.condition`
-   `sales_posts.external_post_id` nếu cần chống trùng theo nguồn.

Không tạo quá nhiều index không cần thiết.

### 8.6. Row Level Security

-   Bật RLS cho các bảng.
-   Không dùng service role key ở frontend.
-   Chỉ tạo SELECT policy cho dữ liệu mà frontend được phép xem.
-   Nếu MVP chỉ dùng dữ liệu demo công khai, có thể cho phép anonymous
    read trên các bản ghi đã được xác định là public.
-   Không cho phép anonymous insert/update/delete nếu không có yêu cầu
    và policy an toàn.
-   Nếu thêm authentication, thiết kế policy theo user và vai trò cụ
    thể.

------------------------------------------------------------------------

## 9. Supabase Client và Data Services

### 9.1. Environment variables

File `.env`:

``` env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

File `.env.example` phải có placeholder, không chứa secret thật.

Thêm `.env` vào `.gitignore`.

### 9.2. Supabase client

Tạo một Supabase client duy nhất tại `src/services/supabaseClient.js`
hoặc `src/lib/supabase.js`.

### 9.3. Service functions

Tạo các hàm có trách nhiệm rõ ràng:

-   `getSalesPosts(filters, pagination, sort)`
-   `getSalesPostById(id)`
-   `getRecentSalesPosts(limit)`
-   `getDashboardStats()`
-   `getPostsByPlatform()`
-   `getPostsByCategory()`
-   `getCategories()`
-   `getSources()`

Không nên dùng một hàm `getData(table)` quá tổng quát làm nơi chứa mọi
business logic. Có thể có helper dùng chung, nhưng các truy vấn nghiệp
vụ nên có tên và input rõ ràng.

### 9.4. Error handling

Mỗi service phải:

-   Kiểm tra `error` trả về từ Supabase.
-   Trả dữ liệu theo format nhất quán.
-   Không âm thầm nuốt lỗi.
-   Không log secret/token.
-   Để UI hiển thị error state thân thiện.

------------------------------------------------------------------------

## 10. Mock Data

Trước khi kết nối Supabase, xây dựng UI bằng mock data.

Mock data cần bao phủ các trường hợp:

-   Facebook post có ảnh và giá.
-   TikTok post có ảnh và giá.
-   Bài đăng không có giá.
-   Bài đăng không có ảnh.
-   Bài đăng không có location.
-   Bài đăng dài.
-   Bài đăng thuộc nhiều categories.
-   Bài đăng có condition khác nhau.
-   Bài đăng mới và cũ.

Mock data phải nằm trong `src/mocks/`, không nhúng trực tiếp vào
component.

Khi tích hợp Supabase, cần có một lớp service/hook để chuyển nguồn dữ
liệu từ mock sang Supabase mà không phải viết lại UI.

------------------------------------------------------------------------

## 11. Responsive Requirements

### Desktop

-   Sidebar luôn hiển thị.
-   Dashboard dùng grid KPI cards.
-   Sales Feed ưu tiên 2--3 cột Card View tùy chiều rộng.
-   Filters hiển thị rõ ràng, có thể nằm trên feed.

### Tablet

-   Sidebar có thể thu gọn.
-   KPI cards tự chuyển số cột.
-   Sales cards hiển thị 2 cột hoặc 1 cột tùy chiều rộng.

### Mobile

-   Sidebar chuyển thành drawer/menu.
-   KPI cards 1--2 cột.
-   Sales Feed 1 cột.
-   Filters có thể mở trong drawer/popover.
-   Search dễ thao tác.
-   Không có horizontal overflow ngoài khu vực bảng nếu thực sự cần.

------------------------------------------------------------------------

## 12. Performance Requirements

-   Dùng pagination ở server/database query.
-   Không tải toàn bộ sales posts về frontend.
-   Chỉ select các cột cần thiết thay vì luôn dùng `select('*')` trong
    production query.
-   Debounce search.
-   Tránh gọi lại query không cần thiết.
-   Có loading skeleton.
-   Có thể cache dữ liệu phù hợp bằng React Query/TanStack Query nếu dự
    án cần.
-   Dashboard stats nên dùng query aggregate hoặc database view/RPC khi
    dữ liệu tăng; không tải toàn bộ posts chỉ để tính KPI.
-   Lazy load hình ảnh.
-   Có fallback khi ảnh lỗi.

Mục tiêu ban đầu: giao diện phản hồi nhanh với dataset demo và quy mô dữ
liệu nhỏ/vừa. Không coi các mốc hiệu năng là cam kết trước khi đo thực
tế.

------------------------------------------------------------------------

## 13. Security & Data Handling

-   Chỉ sử dụng dữ liệu mà người dùng có quyền truy cập và sử dụng.
-   Không xây dựng scraping trái phép hoặc bypass login, paywall, rate
    limit hay biện pháp bảo vệ nền tảng.
-   Không lưu thông tin đăng nhập Facebook/TikTok.
-   Không lưu API secrets trong frontend.
-   Không đưa dữ liệu nhạy cảm vào mock data hoặc log.
-   RLS phải được bật và kiểm tra.
-   External links phải mở an toàn.
-   Nội dung bài đăng là dữ liệu không đáng tin cậy; render dưới dạng
    text, tránh inject HTML.
-   Chỉ hiển thị media theo quyền sử dụng và chính sách nguồn.

------------------------------------------------------------------------

## 14. Acceptance Criteria

MVP được xem là hoàn thành khi:

### General

-   [ ] Project chạy được bằng `npm install` và `npm run dev`.
-   [ ] Có cấu trúc thư mục rõ ràng.
-   [ ] Có responsive layout.
-   [ ] Không có lỗi console nghiêm trọng.
-   [ ] Có loading, empty và error states.

### Dashboard

-   [ ] Hiển thị Total Posts.
-   [ ] Hiển thị Posts Today.
-   [ ] Hiển thị Posts This Week.
-   [ ] Hiển thị Favorites (theo phương án đã chọn).
-   [ ] Biểu đồ platform lấy từ dữ liệu.
-   [ ] Biểu đồ category lấy từ dữ liệu.
-   [ ] Recent Posts hiển thị bài mới nhất.
-   [ ] Refresh hoạt động.

### Sales Feed

-   [ ] Hiển thị danh sách bài đăng.
-   [ ] Card View hoạt động.
-   [ ] Compact List View hoạt động.
-   [ ] Search hoạt động.
-   [ ] Platform filter hoạt động.
-   [ ] Category filter hoạt động.
-   [ ] Price filter hoạt động.
-   [ ] Date filter hoạt động.
-   [ ] Condition filter hoạt động.
-   [ ] Sort hoạt động.
-   [ ] Pagination hoạt động.
-   [ ] Clear filters hoạt động.
-   [ ] Original Post link mở đúng URL.
-   [ ] Favorites hoạt động theo phương án đã chọn.
-   [ ] Missing image/price/location không làm vỡ layout.

### Supabase

-   [ ] Supabase client kết nối thành công.
-   [ ] Sales Feed đọc dữ liệu từ Supabase.
-   [ ] Dashboard lấy số liệu từ Supabase.
-   [ ] RLS policy được bật và kiểm tra.
-   [ ] Không có service role key trong frontend hoặc Git repository.

------------------------------------------------------------------------

## 15. Hướng dẫn cho AI Coding Agent

### 15.1. Vai trò

Bạn là một senior frontend engineer có kinh nghiệm xây dựng SaaS
dashboard bằng React, Vite, Tailwind CSS và Supabase.

### 15.2. Quy tắc triển khai

1.  Đọc toàn bộ tài liệu này trước khi code.
2.  Chỉ triển khai phạm vi MVP: Dashboard và Sales Feed.
3.  Không tự ý thêm crawling, AI backend, chatbot hoặc các trang chưa
    được yêu cầu.
4.  Ưu tiên hoàn thiện UI bằng mock data trước.
5.  Giữ code modular, dễ đọc và dễ bảo trì.
6.  Không viết toàn bộ ứng dụng trong một file.
7.  Không hardcode dữ liệu thống kê vào Dashboard.
8.  Tách Supabase queries vào services.
9.  Tách reusable UI thành components.
10. Xử lý loading, error, empty và missing data.
11. Không sử dụng secret keys ở frontend.
12. Không bỏ qua RLS.
13. Không tạo nút hoặc chức năng chỉ để trang trí nếu chúng được thể
    hiện như có thể sử dụng.
14. Nếu một yêu cầu có nhiều cách triển khai, chọn phương án đơn giản,
    an toàn và phù hợp MVP.
15. Nếu thiếu thông tin ảnh hưởng đến schema hoặc security, hỏi lại
    trước khi tự quyết định.

### 15.3. Thứ tự thực hiện

**Step 1 --- Project setup** - Khởi tạo React + Vite. - Cài
dependencies. - Cấu hình Tailwind CSS. - Cấu hình routing. - Tạo
AppLayout, Sidebar, Header.

**Step 2 --- Dashboard UI** - Dùng mock data. - Hoàn thiện KPI cards. -
Hoàn thiện charts. - Hoàn thiện Recent Posts. - Kiểm tra responsive.

**Step 3 --- Sales Feed UI** - Dùng mock data. - Hoàn thiện Card View. -
Hoàn thiện Compact List View. - Hoàn thiện Search và Filters. - Hoàn
thiện Pagination. - Hoàn thiện Favorites UI.

**Step 4 --- Supabase** - Tạo Supabase client. - Tạo schema và
indexes. - Bật RLS và tạo policies phù hợp. - Tạo service functions. -
Thay mock data bằng Supabase data.

**Step 5 --- Testing & polish** - Test các trạng thái. - Test filters
kết hợp. - Test pagination và sorting. - Test responsive. - Kiểm tra
console và network errors. - Cập nhật README hướng dẫn chạy dự án và cấu
hình Supabase.

### 15.4. Definition of Done

Không chỉ tạo ra giao diện nhìn đẹp. Mỗi chức năng được đánh dấu hoàn
thành phải hoạt động thực sự, có dữ liệu hợp lý, có xử lý lỗi và không
tạo ra hành vi giả.

------------------------------------------------------------------------

## 16. Các quyết định còn mở cần xác nhận

AI coding agent không nên tự suy đoán các quyết định dưới đây nếu chúng
ảnh hưởng đến database hoặc behavior:

1.  **Favorites:** Dùng localStorage cho single-user MVP hay Supabase
    Auth để đồng bộ?
2.  **Timezone:** Dùng timezone trình duyệt hay cố định một timezone cho
    báo cáo?
3.  **Categories:** Dùng danh mục cố định ban đầu hay đọc hoàn toàn từ
    bảng `categories`?
4.  **Data source:** Dữ liệu demo được seed vào Supabase hay tiếp tục
    dùng mock data trong frontend cho đến khi UI hoàn thiện?
5.  **Image handling:** Chỉ dùng external image URL được phép hay có nhu
    cầu dùng Supabase Storage?

Nếu chưa có quyết định, hãy chọn giải pháp tạm thời đơn giản nhất, ghi
rõ trong README và không tạo ra thiết kế khó thay đổi.

------------------------------------------------------------------------

## 17. Tóm tắt yêu cầu cuối cùng

**Sản phẩm:** AI Sales Radar --- MVP

**Mục tiêu hiện tại:** Xây dựng website hiển thị và quản lý sales posts.

**Hai trang cần làm trước:** 1. Dashboard. 2. Sales Feed.

**Frontend:** React + Vite + JavaScript + Tailwind CSS.

**Database:** Supabase Free (PostgreSQL).

**Data access:** Frontend gọi Supabase trực tiếp bằng
`@supabase/supabase-js`.

**Backend riêng:** Chưa cần.

**Crawling:** Chưa cần.

**AI processing:** Chưa cần.

**Development approach:** Mock data → UI hoàn chỉnh → Supabase schema →
Supabase integration → Testing.

> **Yêu cầu quan trọng nhất:** Hãy xây dựng một MVP gọn nhẹ, giao diện
> chuyên nghiệp, dữ liệu hiển thị chính xác, code có cấu trúc tốt và sẵn
> sàng mở rộng. Không over-engineer và không triển khai các tính năng
> ngoài phạm vi đã thống nhất.
