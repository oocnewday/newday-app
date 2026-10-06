/*! ND-ADMIN-JS 1.4 api=1 */
(function(ND){const ADMIN_JS_VERSION="1.4";const ADMIN_API_MIN=1;if(!ND||!(ND.apiVersion>=ADMIN_API_MIN)){if(ND&&typeof ND.registerAdmin==="function")ND.registerAdmin({outdated:true});return;}const{supabaseClient,showToast,showGlobalError,showAuthError,ndEscape,navigate,ndImageFromLink,ndIsHttpUrl,ndMediaBadges,ndNewId,ndCompressImageFile,ndTodayISO,getFreshAccessToken,withTimeout,SUPABASE_URL,APP_VERSION,APP_VERSION_LABEL,refreshMotivData,pickMotivationMessage,renderComingSoonSheetList,renderAllContactButtons,contactUrlOk,CONTACT_PLACES,CONTACT_CACHE_KEY,fbDeviceLines,saveWelcomeMessage,saveSignupIntroText,loadSignupIntroText,saveRecomputeCycleDays,saveComingSoonItems,saveDebugTimeOffset,resetTimeTravel,resetAll,refreshAdminBadges,applyAdminBadges,adminCan,seenAt,seenKey,adminBadgeCache,categorizeMember,adminSeenServer,saveAdminUnlocked}=ND;const ADMIN_PANEL_HTML=`<div class="screen" id="adminPanel">
  <div class="chapters-header">
    <div class="breadcrumb">
      <button class="crumb-back crumb-back-lg" id="adminLockBtn">🔒 قفل وخروج</button>
    </div>
    <h1 class="chapters-title">🔐 Admin Panel</h1>
    <p class="chapters-sub">تعديل محتوى التطبيق</p>
  </div>

  <div class="chapters-body">
    <div class="app-guide-list" id="adminSectionsList">

      <!-- 1) Motivation Message -->
      <div class="app-guide-item admin-item" data-perm="motivation">
        <div class="app-guide-header"><span class="app-guide-icon">📝</span><span class="app-guide-title">Motivation Message</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">الرسالة الكبيرة في صفحة "يوم جديد" اللي بتظهر بعد الدخول. تقدر تضيف أكتر من رسالة وتختار طريقة ظهورها.</span>
            <label class="admin-label">طريقة الظهور</label>
            <div class="admin-row2">
              <div><select class="admin-textarea" id="motivRotMode">
                <option value="rotate">🔄 دوران بين الرسائل</option>
                <option value="fixed">📌 رسالة ثابتة (إيقاف الدوران)</option>
              </select></div>
              <div id="motivRotEveryWrap"><select class="admin-textarea" id="motivRotEvery">
                <option value="1">كل يوم</option><option value="2">كل يومين</option><option value="3">كل 3 أيام</option>
                <option value="4">كل 4 أيام</option><option value="5">كل 5 أيام</option><option value="7">كل أسبوع</option>
                <option value="14">كل أسبوعين</option><option value="30">كل شهر</option>
              </select></div>
            </div>
            <button class="admin-save-btn" id="motivRotSave" type="button">💾 حفظ طريقة الظهور</button>
            <span class="ag-note">الرسالة اللي ليها فترة (من/إلى) بتظهر خلال فترتها بدل الدوران أو الثابتة — دي الجدولة.</span>
            <div class="admin-notif-archive" id="motivAdminList" style="display:flex;"></div>
            <button class="admin-add-btn" id="motivNewBtn" type="button">+ رسالة جديدة</button>
            <div id="motivEditor" style="display:none;" class="admin-subsection">
              <label class="admin-label" id="motivEdTitle">رسالة جديدة</label>
              <textarea class="admin-textarea" id="motivEdText" rows="3" placeholder="نص الرسالة التحفيزية"></textarea>
              <div id="motivEdMedia"></div>
              <label class="admin-label">فترة الظهور (اختياري — للجدولة)</label>
              <div class="admin-row2">
                <div><label class="admin-label">من</label><input type="date" class="admin-textarea" id="motivEdFrom"></div>
                <div><label class="admin-label">إلى</label><input type="date" class="admin-textarea" id="motivEdUntil"></div>
              </div>
              <div class="admin-row2">
                <div><button class="admin-save-btn" id="motivEdSave" type="button">💾 حفظ الرسالة</button></div>
                <div><button class="admin-add-btn" id="motivEdCancel" type="button" style="width:100%;">إلغاء</button></div>
              </div>
            </div>
            <div class="admin-subsection">
              <label class="admin-label">💬 جمل الترحيب حسب حالة العضو</label>
              <span class="ag-note">بتظهر تحت "أهلًا يا د/ ..." في صفحة الرسالة. كل مرة بتتختار جملة مختلفة عن آخر اللي شافه نفس العضو.</span>
              <select class="admin-textarea" id="phraseSituation"></select>
              <span class="ag-note" id="phraseHelp"></span>
              <div id="phraseList"></div>
              <textarea class="admin-textarea" id="phraseNewText" rows="2" placeholder="جملة جديدة للحالة دي..."></textarea>
              <button class="admin-add-btn" id="phraseAddBtn" type="button">+ إضافة جملة</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2) Welcome Message -->
      <div class="app-guide-item admin-item" data-perm="welcome">
        <div class="app-guide-header"><span class="app-guide-icon">💬</span><span class="app-guide-title">Welcome Message</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <label class="admin-label">النص الكامل (بائع الثلج)</label>
            <textarea class="admin-textarea admin-textarea-lg" id="adminWelcomeText" rows="10"></textarea>
            <button class="admin-save-btn" id="adminWelcomeSave">💾 حفظ</button>
          </div>
        </div>
      </div>

      <!-- 3) Notifications — بقت جاهزة تصميميًا، الإرسال الفعلي محتاج Supabase -->
      <div class="app-guide-item admin-item" data-perm="notifications notif_manage reminder_texts">
        <div class="app-guide-header"><span class="app-guide-icon">🔔</span><span class="app-guide-title">Notifications</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <div data-perm="notifications">
            <span class="ag-note">✅ الرسالة بتتحفظ في صندوق الإشعارات جوه التطبيق. "إرسال فوري" بيوصل كإشعار حقيقي على الموبايلات في نفس اللحظة. ولو ربطتها بتذكير، هتتبعت مع التذكير ده لكل عضو في ميعاده بدل الرسالة الافتراضية.</span>
            <label class="admin-label">نوع الإرسال</label>
            <select class="admin-textarea" id="adminNotifTarget">
              <option value="now">📨 رسالة عادية (دلوقتي أو في موعد)</option>
              <option value="r1">⏰ مع التذكير الأول</option>
              <option value="r2">⏰ مع التذكير الثاني</option>
              <option value="r3">⏰ مع التذكير الثالث</option>
            </select>
            <label class="admin-label">الجمهور</label>
            <select class="admin-textarea" id="adminNotifAudience">
              <option value="members">👤 الأعضاء المسجّلين بس</option>
              <option value="all">🌍 الكل (أعضاء + زوار فعّلوا الإعلانات العامة)</option>
            </select>
            <div id="adminNotifWhenWrap">
              <label class="admin-label">وقت الإرسال</label>
              <select class="admin-textarea" id="adminNotifWhen">
                <option value="now">📨 إرسال الآن</option>
                <option value="later">⏳ في موعد محدد (يوم وساعة)</option>
              </select>
              <div class="admin-row2" id="adminNotifScheduleRow" style="display:none;">
                <div><label class="admin-label">اليوم</label><input type="date" class="admin-textarea" id="adminNotifSchedDate"></div>
                <div><label class="admin-label">الساعة</label><input type="time" class="admin-textarea" id="adminNotifSchedTime"></div>
              </div>
              <span class="ag-note" id="adminNotifScheduleNote" style="display:none;">تقدر تختار أي يوم، حتى بعد شهور أو سنين. الرسالة هتتبعت في الدقيقة دي (بفرق أقصاه دقيقة)، ومش هتظهر في صندوق أي حد قبلها.</span>
            </div>
            <label class="admin-label">نص الرسالة</label>
            <textarea class="admin-textarea" id="adminNotifText" rows="3" placeholder="مثال: فاكر تحل أسئلتك النهاردة؟ 🔥"></textarea>
            <span class="ag-note">النص ده هو اللي بيظهر في الإشعار وفي سطر المعاينة في الصندوق.</span>
            <label class="admin-label">تفاصيل الرسالة (اختياري — بتظهر لما العضو يضغط على الرسالة)</label>
            <textarea class="admin-textarea" id="adminNotifBody" rows="4" placeholder="اكتب التفاصيل هنا... وأي رابط هيتحوّل لرابط يتضغط عليه"></textarea>
            <div id="adminNotifMediaEditor"></div>
            <div id="adminNotifValidityWrap" style="display:none;">
              <label class="admin-label">فترة صلاحية الرسالة مع التذكير</label>
              <div class="admin-row2">
                <div><label class="admin-label">من</label><input type="date" class="admin-textarea" id="adminNotifValidFrom"></div>
                <div><label class="admin-label">إلى</label><input type="date" class="admin-textarea" id="adminNotifValidUntil"></div>
              </div>
              <span class="ag-note">بعد آخر يوم، التذكير بيرجع تلقائيًا لرسالته الأساسية. لو سبت "إلى" فاضية، هتفضل شغالة لحد ما تلغيها من الأرشيف.</span>
            </div>
            <button class="admin-save-btn" id="adminNotifSend">📨 إرسال</button>
            </div>
            <div data-perm="notifications notif_manage">
            <button class="admin-archive-toggle" id="adminNotifArchiveToggle" type="button">📦 أرشيف الرسائل المرسلة ▾</button>
            <select class="admin-textarea" id="adminNotifFilter" style="display:none; margin-top:8px;">
              <option value="all">كل الرسائل</option>
              <option value="now">📨 الفورية بس</option>
              <option value="linked">⏰ المربوطة بتذكير</option>
              <option value="hidden">🙈 المخفية</option>
              <option value="cancelled">⛔ الملغية</option>
              <option value="scheduled">⏳ المجدولة (لسه ماتبعتتش)</option>
            </select>
            <div class="admin-notif-archive" id="adminNotifArchiveList" style="display:none;"></div>
            </div>
            <div class="admin-subsection" data-perm="reminder_texts">
              <label class="admin-label">✍️ الرسالة الأساسية لكل تذكير</label>
              <span class="ag-note">بتتبعت مع التذكير لما مايكونش فيه رسالة مربوطة سارية. سيبها فاضية عشان يتبعت الحديث الافتراضي.</span>
              <label class="admin-label">التذكير الأول</label>
              <textarea class="admin-textarea" id="adminReminderBase_r1" rows="2"></textarea>
              <label class="admin-label">التذكير الثاني</label>
              <textarea class="admin-textarea" id="adminReminderBase_r2" rows="2"></textarea>
              <label class="admin-label">التذكير الثالث</label>
              <textarea class="admin-textarea" id="adminReminderBase_r3" rows="2"></textarea>
              <button class="admin-save-btn" id="adminReminderBaseSave" type="button">💾 حفظ الرسائل الأساسية</button>
              <div class="admin-auth-warning" id="adminReminderBaseWarning"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4) إدارة عناصر "قريبًا بإذن الله" في الملف الشخصي -->
      <div class="app-guide-item admin-item" data-perm="comingsoon">
        <div class="app-guide-header"><span class="app-guide-icon">📋</span><span class="app-guide-title">عناصر "قريبًا بإذن الله"</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">ده اللي ظاهر في الملف الشخصي تحت "قريبًا بإذن الله". عدّل أي عنصر واضغط برة الحقل يتحفظ لوحده، أو دوس ✕ لحذفه.</span>
            <label class="admin-label">العناصر الحالية</label>
            <div class="admin-url-list" id="adminComingSoonList"></div>
            <div class="admin-add-row">
              <input type="text" class="admin-input" id="adminComingSoonInput" placeholder="مثال: 🎯 ميزة جديدة قريبًا..." dir="rtl">
              <button class="admin-add-btn" id="adminComingSoonAdd">+ إضافة عنصر</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4-b) نص مقدمة استمارة إنشاء الحساب -->
      <div class="app-guide-item admin-item" data-perm="fields">
        <div class="app-guide-header"><span class="app-guide-icon">💬</span><span class="app-guide-title">مقدمة استمارة التسجيل</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">نص بيظهر فوق استمارة إنشاء الحساب قبل ما المستخدم يبدأ يكتب بياناته.</span>
            <textarea class="admin-textarea" id="adminSignupIntroText" rows="3" placeholder="مثال: بياناتك دي بتُستخدم للتواصل معاك بس ومش بتتشارك مع حد."></textarea>
            <button class="admin-save-btn" id="adminSignupIntroSave">💾 حفظ</button>
            <div class="admin-auth-warning" id="adminSignupIntroWarning"></div>
          </div>
        </div>
      </div>

      <!-- 4-c) إدارة حقول استمارة التسجيل -->
      <div class="app-guide-item admin-item" data-perm="fields">
        <div class="app-guide-header"><span class="app-guide-icon">🧾</span><span class="app-guide-title">حقول استمارة التسجيل</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">الإيميل وكلمة السر ثابتين دايمًا. أي حقل تاني تقدر تضيفه أو تعدّله أو تشيله بحرية كاملة.</span>
            <div class="admin-auth-warning" id="adminFieldsWarning"></div>
            <label class="admin-label">العناصر الحالية</label>
            <div id="adminFieldsList"></div>

            <label class="admin-label">➕ إضافة حقل جديد</label>
            <input type="text" class="admin-input" id="newFieldLabel" placeholder="عنوان الحقل (مثال: التخصص)" dir="rtl" style="width:100%;box-sizing:border-box;margin-bottom:8px;">
            <select class="admin-textarea" id="newFieldType">
              <option value="text">نص حر</option>
              <option value="number">رقم</option>
              <option value="select">اختيار من قائمة (تكتبها بنفسك)</option>
              <option value="multi_select">اختيار متعدد من قائمة (تكتبها بنفسك)</option>
              <option value="country">دولة (من قائمة جاهزة)</option>
              <option value="phone_country_code">رقم تواصل بكود دولة</option>
            </select>
            <div id="newFieldExtra"></div>
            <textarea class="admin-textarea" id="newFieldHelp" rows="2" placeholder="شرح/مثال يظهر تحت الحقل (اختياري)"></textarea>
            <label class="admin-checkbox-row"><input type="checkbox" id="newFieldRequired"> إجباري</label>
            <button class="admin-save-btn" id="addFieldBtn">+ إضافة الحقل</button>
          </div>
        </div>
      </div>

      <!-- 4-d) قوائم الدول -->
      <div class="app-guide-item admin-item" data-perm="countries">
        <div class="app-guide-header"><span class="app-guide-icon">🌍</span><span class="app-guide-title">قوائم الدول</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">فعّل أو ألغِ أي دولة من كل قائمة على حدة — القوائم مستقلة تمامًا عن بعضها.</span>
            <div class="admin-auth-warning" id="adminCountriesWarning"></div>
            <label class="admin-label">اختر القائمة</label>
            <select class="admin-textarea" id="countryListPicker">
              <option value="nationality">الجنسية</option>
              <option value="residence">دولة الإقامة</option>
              <option value="contact_code">كود رقم التواصل</option>
            </select>
            <input type="text" class="admin-input" id="countrySearchInput" placeholder="دور على دولة..." style="width:100%;box-sizing:border-box;margin:8px 0;" dir="rtl">
            <div class="admin-country-list" id="adminCountriesList"></div>

            <label class="admin-label">➕ إضافة دولة جديدة (تتسجل في القوائم التلاتة)</label>
            <input type="text" class="admin-input" id="newCountryNameAr" placeholder="الاسم بالعربي" dir="rtl" style="width:100%;box-sizing:border-box;margin-bottom:6px;">
            <input type="text" class="admin-input" id="newCountryNameEn" placeholder="Name in English" dir="ltr" style="width:100%;box-sizing:border-box;margin-bottom:6px;">
            <input type="text" class="admin-input" id="newCountryDialCode" placeholder="+xxx" dir="ltr" style="width:100%;box-sizing:border-box;margin-bottom:6px;">
            <input type="text" class="admin-input" id="newCountryFlag" placeholder="علم الدولة (إيموجي، مثال 🇪🇬)" dir="ltr" style="width:100%;box-sizing:border-box;margin-bottom:8px;">
            <button class="admin-save-btn" id="addCountryBtn">+ إضافة الدولة</button>
          </div>
        </div>
      </div>

      <!-- 5) الأعضاء (تصفّح بالفئات: منتظرة / مفعّلة / ملغية) -->
      <div class="app-guide-item admin-item" data-perm="feedback">
        <div class="app-guide-header"><span class="app-guide-icon">💬</span><span class="app-guide-title">رسائل الأعضاء (Feedback)</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <label class="admin-label">ظهور الآراء الجديدة للزملاء</label>
            <select class="admin-textarea" id="fbModeSel">
              <option value="auto">⚡ تظهر علطول (من غير مراجعة)</option>
              <option value="review">🛡️ بعد موافقة الأدمن</option>
            </select>
            <button class="admin-save-btn" id="fbModeSave" type="button">💾 حفظ</button>
            <label class="admin-checkbox-row fb-note-toggle"><input type="checkbox" id="fbPublishedNoteCb"> صاحب الرأي المنشور يشوف جملة «👥 منشور لزملائك»</label>
            <label class="admin-checkbox-row fb-note-toggle"><input type="checkbox" id="fbHiddenNoteCb"> صاحب الرأي المخفي يشوف جملة «🙈 غير ظاهر لزملائك»</label>
            <span class="ag-note">لو مش متعلّم: الرأي المخفي بيفضل ظاهر لصاحبه عادي من غير أي جملة، ومختفي عن الباقيين.</span>
            <span class="ag-note">المشاكل الفنية مابتظهرش للأعضاء أبدًا — بتوصل هنا بس، ومعاها بيانات جهاز العضو ورقم البلاغ.</span>
            <div class="admin-subsection">
              <label class="admin-label">📞 وسائل التواصل</label>
              <span class="ag-note">كل وسيلة بتظهر في الأماكن اللي متعلّم عليها بس. مكان مالوش أي وسيلة ← أزرار التواصل مابتظهرش فيه (وفي البلاغ الفني العضو بيشوف "تم إرسالها للإدارة بإذن الله").</span>
              <div id="contactEditor"></div>
              <button class="admin-add-btn" id="contactAddBtn" type="button">+ إضافة وسيلة</button>
            </div>
            <label class="admin-label">عرض</label>
            <select class="admin-textarea" id="fbAdminFilter">
              <option value="all">الكل</option>
              <option value="problem_open">🛠️ مشاكل فنية مفتوحة</option>
              <option value="pending">⏳ في انتظار الموافقة</option>
              <option value="suggestion">💡 الاقتراحات والآراء</option>
              <option value="hidden">🙈 المخفية</option>
              <option value="done">✅ تمت بفضل الله</option>
            </select>
            <input type="search" class="admin-textarea" id="fbAdminSearch" dir="auto" placeholder="🔎 ابحث برقم البلاغ (مثل B-2709-4F2A) أو الإيميل أو الاسم">
            <div class="admin-notif-archive" id="fbAdminList" style="display:flex;"></div>
          </div>
        </div>
      </div>
      <div class="app-guide-item admin-item" data-perm="admin_names">
        <div class="app-guide-header"><span class="app-guide-icon">🏷️</span><span class="app-guide-title">أسماء الأدمن</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">اسم كل أدمن أو مالك جوه لوحة الأدمن بس (مين فعّل عضو، مين بعت إشعار، مين علّم على بلاغ "تمت"...). الأعضاء مابيشوفوهوش — بيفضلوا يشوفوا اسمه في المضمار. لو فاضي بيظهر اسمه كعضو.</span>
            <div id="staffNamesList"></div>
          </div>
        </div>
      </div>
      <div class="app-guide-item admin-item" data-perm="members">
        <div class="app-guide-header"><span class="app-guide-icon">👥</span><span class="app-guide-title">الأعضاء</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">وافق أو ألغِ تفعيل أي عضو، واسمحله يغيّر اسمه تاني لو محتاج، وشوف بياناته اللي ملاها وقت التسجيل.</span>
            <div class="admin-auth-warning" id="adminMembersWarning"></div>

            <div class="admin-owner-add-row" id="adminOwnerAddRow" style="display:none;">
              <input type="email" class="admin-input" id="newAdminEmail" placeholder="إيميل عضو مسجّل عندنا" dir="ltr" style="width:100%;box-sizing:border-box;margin-bottom:8px;">
              <button class="admin-add-btn" id="addAdminBtn">+ ترقية لأدمن</button>
            </div>

            <!-- المستوى صفر: بحث عام + الفئات -->
            <div id="membersLevelCategories">
              <input type="text" class="admin-input" id="membersGlobalSearch" placeholder="🔍 دور بإيميل عضو (من كل الفئات)..." dir="ltr" style="width:100%;box-sizing:border-box;margin-bottom:10px;">
              <div class="member-category-grid" id="membersCategoryGrid">
                <button type="button" class="member-category-card cat-pending" data-cat="pending">
                  <span class="mcc-icon">⏳</span><span class="mcc-label">منتظرة تفعيل</span><span class="mcc-count" id="catCountPending">0</span>
                </button>
                <button type="button" class="member-category-card cat-active" data-cat="active">
                  <span class="mcc-icon">✅</span><span class="mcc-label">مفعّلة</span><span class="mcc-count" id="catCountActive">0</span>
                </button>
                <button type="button" class="member-category-card cat-revoked" data-cat="revoked">
                  <span class="mcc-icon">🚫</span><span class="mcc-label">تم إلغاء تفعيلها</span><span class="mcc-count" id="catCountRevoked">0</span>
                </button>
                <button type="button" class="member-category-card cat-admins" data-cat="admins" id="catCardAdmins" style="display:none;">
                  <span class="mcc-icon">🛡️</span><span class="mcc-label">الأدمنز</span><span class="mcc-count" id="catCountAdmins">0</span>
                </button>
              </div>
            </div>

            <!-- المستوى الأول: قائمة إيميلات الفئة (أو نتائج البحث العام) -->
            <div id="membersLevelList" style="display:none;">
              <button type="button" class="member-back-btn" id="membersBackToCategories">← رجوع للفئات</button>
              <input type="text" class="admin-input" id="membersListSearch" placeholder="🔍 دور بإيميل داخل القائمة دي..." dir="ltr" style="width:100%;box-sizing:border-box;margin:8px 0;">
              <div id="membersEmailList"></div>
            </div>

            <!-- المستوى الثاني: تفاصيل عضو واحد -->
            <div id="membersLevelDetail" style="display:none;">
              <button type="button" class="member-back-btn" id="membersBackToList">← رجوع للقائمة</button>
              <div id="membersDetailContent"></div>
            </div>

            <!-- (1.3) أوامر المسح والحذف لكل الأعضاء (ومنهم اللي اتحذفوا)، لصلاحية member_wipe بس -->
            <div class="admin-wipe-all" id="adminWipeAllWrap" style="display:none;">
              <div class="admin-wipe-all-title">🧹 أوامر المسح والحذف</div>
              <button class="admin-save-btn" id="adminWipeAllRefresh" type="button">🔄 تحديث</button>
              <div id="adminWipeAllList"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- (1.1) بند 44 (1): تبديل الأجهزة — قراية بس، بصلاحية الأعضاء -->
      <div class="app-guide-item admin-item" id="adminDevicesItem" data-perm="members">
        <div class="app-guide-header"><span class="app-guide-icon">📱</span><span class="app-guide-title">تبديل الأجهزة</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">الحساب بيشتغل على جهاز واحد في نفس الوقت. هنا كل مرة حساب اتفتح على جهاز غير اللي كان شغال عليه في آخر 7 أيام، والحسابات مترتبة بعدد التبديلات. تبديلات كتير أو أجهزة كتير ممكن معناها إن أكتر من حد بيستخدم نفس الحساب، والقرار للإدارة. حسابات الإدارة مابتتسجّلش هنا.</span>
            <button class="admin-save-btn" id="devSwitchRefresh" type="button">🔄 تحديث</button>
            <div id="devSwitchList"></div>
          </div>
        </div>
      </div>

      <!-- (1.3) بند 49: الأجهزة اللي فضل فيها اختلاف بين الأسئلة على الجهاز والسيرفر بعد التصليح التلقائي — قراية بس -->
      <div class="app-guide-item admin-item" id="adminBankChecksItem" data-perm="members">
        <div class="app-guide-header"><span class="app-guide-icon">🔎</span><span class="app-guide-title">اختلافات البنك</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">التطبيق بيقارن الأسئلة اللي على موبايل العضو بالسيرفر مرة في اليوم، ولو لقى اختلاف بينزّلها كلها تاني لوحده. هنا آخر 30 جهاز فضل فيهم اختلاف بعد كده. الحل: "🧹 امسح بنك الأسئلة من موبايله" من كارت العضو، فالأسئلة تتنزّل من جديد.</span>
            <button class="admin-save-btn" id="bankChecksRefresh" type="button">🔄 تحديث</button>
            <div id="bankChecksList"></div>
          </div>
        </div>
      </div>

      <!-- 6) إعدادات نظام النقاط — دائمة، بتطبّق على كل المستخدمين (مش اختبار) -->
      <div class="app-guide-item admin-item" data-perm="points">
        <div class="app-guide-header"><span class="app-guide-icon">🏆</span><span class="app-guide-title">إعدادات نظام النقاط</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">✅ ده إعداد دائم وبيطبّق على كل المستخدمين فورًا (مش تجربة)، بيتحفظ في قاعدة البيانات مباشرة.</span>
            <label class="admin-label">⏱️ مدة دورة إعادة احتساب النقاط (بالأيام) — بعد ما تعدّي من أول مرة يحل فيها المستخدم السؤال صح، السؤال يرجع فاضي تمامًا ويقدر ياخد نقاط عليه تاني</label>
            <input type="number" class="admin-input" id="recomputeCycleInput" min="1" style="width:100%;box-sizing:border-box;margin-bottom:8px;">
            <button class="admin-save-btn" id="recomputeCycleSave">💾 حفظ المدة لكل المستخدمين</button>
          </div>
        </div>
      </div>

      <!-- (1.3) بند 49، طلب صاحب المشروع 4/10: مرجع ثابت لكل الإدارة عشان الفريق مايتساش (من غير data-perm = ظاهر لكل اللي بيفتح اللوحة) -->
      <div class="app-guide-item admin-item" id="adminShortcutsItem">
        <div class="app-guide-header"><span class="app-guide-icon">👆</span><span class="app-guide-title">اختصارات</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <div class="admin-shortcut-row"><b>اختصار الزائر:</b> 5 لمسات ورا بعض على سطر رقم الإصدار (Version) في About، والطالب مش داخل بحساب ← الأسئلة على الموبايل ده بتتحدّث لحدود الزائر (أول 10 أسئلة في كل فولدر).</div>
            <div class="admin-shortcut-row"><b>اختصار العضو:</b> نفس اللمسات والطالب داخل بحسابه ← الأسئلة بتتحدّث لمستوى حسابه (غير المفعّل أول 20 في كل فولدر، والمفعّل البنك كامل).</div>
            <span class="ag-note">الاتنين محتاجين نت، والأسئلة القديمة بتفضل لحد ما الجديدة توصل كاملة. مفيدين لو طالب بيشتكي إن أسئلة ناقصة أو قديمة عنده.</span>
          </div>
        </div>
      </div>

      <!-- 6-b) فرض تحديث إصدار التطبيق على كل الأجهزة — المالك بس -->
      <div class="app-guide-item admin-item" id="adminVersionItem" data-perm="version">
        <div class="app-guide-header"><span class="app-guide-icon">🆕</span><span class="app-guide-title">إصدار التطبيق</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note" id="versionStatusNote">بيتحمّل...</span>
            <button class="admin-save-btn" id="publishVersionBtn">🚀 نشر هذا الإصدار على كل الأجهزة</button>
            <span class="ag-note" style="margin-top:8px;">دوس الزرار ده بس لما توزّع نسخة ملف جديدة على الكل — بياخد رقم النسخة من الملف اللي فاتح بين إيديك دلوقتي تلقائيًا، مفيش أرقام تكتبها.</span>
          </div>
        </div>
      </div>

      <!-- 7) Testing Tools — المالك بس، لجهازه هو فقط -->
      <div class="app-guide-item admin-item" id="adminTestingToolsItem" data-perm="testing_tools">
        <div class="app-guide-header"><span class="app-guide-icon">🧪</span><span class="app-guide-title">Testing Tools</span><span class="app-guide-chevron">▾</span></div>
        <div class="app-guide-content-wrap">
          <div class="app-guide-content admin-form">
            <span class="ag-note">⚠️ الأدوات دي بتأثر على جهازك الحالي بس (مش على بيانات باقي المستخدمين)، ومعظمها بيحتاج إعادة فتح التطبيق.</span>
            <button class="admin-save-btn admin-danger-btn" id="ttResetAll">🗑️ Reset All Data</button>
            <button class="admin-save-btn admin-danger-btn" id="ttSimulateNewUser">👤 Simulate New User</button>
            <button class="admin-save-btn" id="ttForwardDay">⏩ Forward 1 Day</button>
            <button class="admin-save-btn" id="ttForwardWeek">⏩ Forward 1 Week</button>
            <button class="admin-save-btn" id="ttResetTime">↩️ Reset Time (Back to Real Now)</button>
          </div>
        </div>
      </div>

      <!-- 8) قريبًا -->
      <div class="app-guide-item admin-item admin-locked">
        <div class="app-guide-header"><span class="app-guide-icon">📖</span><span class="app-guide-title">App Guide Content</span><span class="profile-soon-badge">قريبًا</span></div>
      </div>

    </div>
  </div>
</div>`;const ADMIN_PANEL_CSS=String.raw`.admin-item.admin-locked{ opacity:0.55; }
.admin-item.admin-locked .app-guide-header{ cursor:default; }
.admin-form{
  display:flex; flex-direction:column; gap:4px;
}
.admin-label{
  font-family:'Cairo',sans-serif; font-size:12px; font-weight:700;
  color:rgba(255,255,255,0.7);
  margin:10px 0 2px;
}
.admin-label:first-child{ margin-top:0; }
.admin-textarea{
  width:100%; box-sizing:border-box;
  background:rgba(255,255,255,0.06);
  border:1.5px solid rgba(255,255,255,0.18);
  border-radius:10px;
  color:#fff;
  font-family:'Cairo',sans-serif; font-size:13px; line-height:1.7;
  padding:10px 12px;
  resize:vertical;
}
.admin-textarea-lg{ min-height:160px; }
.admin-url-list{ display:flex; flex-direction:column; gap:6px; }
.admin-url-row{
  display:flex; align-items:center; gap:8px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:8px;
  padding:7px 10px;
}
.admin-url-row span{
  flex:1; font-size:12px; color:rgba(255,255,255,0.8);
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  direction:ltr; text-align:left;
}
.admin-cs-edit{
  flex:1; box-sizing:border-box;
  background:transparent; border:none;
  color:#fff; font-family:'Cairo',sans-serif; font-size:12.5px;
  padding:2px 0;
  outline:none;
}
.admin-cs-edit:focus{ border-bottom:1px solid rgba(255,255,255,0.3); }
.admin-url-remove{
  background:none; border:none;
  color:var(--q-rose, #9C3B4C);
  font-size:14px; cursor:pointer; flex-shrink:0;
}
.admin-add-row{ display:flex; gap:8px; margin-top:4px; }
.admin-input{
  flex:1; box-sizing:border-box;
  background:rgba(255,255,255,0.06);
  border:1.5px solid rgba(255,255,255,0.18);
  border-radius:8px;
  color:#fff; font-family:'Cairo',sans-serif; font-size:12.5px;
  padding:8px 10px;
  direction:ltr; text-align:left;
}
.admin-add-btn{
  flex-shrink:0;
  background:rgba(255,255,255,0.1);
  border:1px solid rgba(255,255,255,0.2);
  color:#fff; font-family:'Cairo',sans-serif; font-size:11.5px; font-weight:700;
  padding:8px 12px; border-radius:8px; cursor:pointer;
  white-space:nowrap;
}
.admin-save-btn{
  margin-top:16px;
  background:var(--q-teal, #1B4B43); color:#fff;
  border:none; border-radius:10px;
  padding:11px; font-family:'Cairo',sans-serif; font-size:13.5px; font-weight:700;
  cursor:pointer;
}
.admin-save-btn.saved-flash{ background:#2f9e63; animation:markPop 0.4s ease; }
.admin-save-btn:disabled{
  background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.45);
  cursor:default;
}
.admin-danger-btn{
  background:var(--q-rose, #9C3B4C);
  margin-bottom:8px;
}
.admin-checkbox-row{
  display:flex; align-items:center; gap:6px;
  font-family:'Cairo',sans-serif; font-size:12px;
  color:rgba(255,255,255,0.8);
  white-space:nowrap;
}
/* صفوف حقول استمارة التسجيل (لوحة الأدمن) */
.admin-field-row{
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:10px;
  padding:10px;
  margin-bottom:8px;
}
.admin-field-row-top{
  display:flex; align-items:center; gap:8px;
  margin-bottom:6px;
}
.admin-field-row-top .admin-field-label-input{ flex:1; }
.admin-field-row-mid{
  display:flex; align-items:center; justify-content:space-between;
  gap:8px; margin-bottom:6px;
}
.admin-field-type-tag{
  font-size:10.5px; font-weight:700;
  color:var(--glow);
  background:rgba(244,208,63,0.12);
  padding:3px 9px; border-radius:8px;
  white-space:nowrap;
}
.admin-field-help-input{ font-size:11.5px; }
.admin-country-list{
  max-height:280px; overflow-y:auto;
  border:1px solid rgba(255,255,255,0.1);
  border-radius:10px;
  padding:6px;
}
.admin-country-row{
  display:flex; align-items:center; gap:8px;
  padding:8px 6px;
  font-family:'Cairo',sans-serif; font-size:12.5px;
  color:#fff;
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.admin-country-row:last-child{ border-bottom:none; }
.admin-member-actions{
  display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;
}
.admin-member-actions .admin-add-btn{ font-size:11px; padding:7px 10px; }
.admin-approve-btn.is-active{
  background:rgba(76,201,133,0.18);
  border-color:rgba(76,201,133,0.4);
  color:#4CC985;
}
.admin-owner-add-row{
  background:rgba(244,208,63,0.06);
  border:1px dashed rgba(244,208,63,0.3);
  border-radius:10px;
  padding:10px;
  margin-bottom:10px;
}
.member-category-grid{
  display:grid; grid-template-columns:1fr; gap:8px;
}
.member-category-card{
  display:flex; align-items:center; gap:10px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:12px;
  padding:14px;
  font-family:'Cairo',sans-serif;
  color:#fff;
  text-align:right;
}
.member-category-card .mcc-icon{ font-size:20px; }
.member-category-card .mcc-label{ flex:1; font-size:13.5px; font-weight:700; }
.member-category-card .mcc-count{
  background:rgba(255,255,255,0.12);
  border-radius:10px;
  padding:3px 10px;
  font-size:12px; font-weight:800;
  direction:ltr;
}
.member-category-card.cat-pending .mcc-count{ background:rgba(244,208,63,0.2); color:var(--glow); }
.member-category-card.cat-active .mcc-count{ background:rgba(76,201,133,0.2); color:#4CC985; }
.member-category-card.cat-revoked .mcc-count{ background:rgba(156,59,76,0.2); color:var(--q-rose); }
.member-category-card.cat-admins .mcc-count{ background:rgba(95,184,171,0.2); color:var(--q-teal, #5fb8ab); }
.member-back-btn{
  background:none; border:none;
  color:var(--q-teal, #5fb8ab);
  font-family:'Cairo',sans-serif; font-size:12.5px; font-weight:700;
  padding:6px 0; margin-bottom:4px;
}
.member-email-row{
  display:flex; align-items:center; justify-content:space-between;
  gap:8px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:10px;
  padding:12px 14px;
  margin-bottom:6px;
  font-family:'Cairo',sans-serif; font-size:12.5px;
  color:#fff;
  direction:ltr; text-align:right;
}
.member-email-row .mer-badge{
  flex-shrink:0;
  font-size:10px; font-weight:700;
  padding:3px 8px; border-radius:8px;
}
.member-email-row .mer-badge.role-admin{ background:rgba(244,208,63,0.15); color:var(--glow); }
.member-email-row .mer-badge.role-owner{ background:rgba(244,208,63,0.25); color:var(--glow); }
.member-detail-card{
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:12px;
  padding:14px;
}
.member-detail-email{
  font-size:14px; font-weight:800; color:#fff;
  direction:ltr; text-align:right;
  margin-bottom:8px; word-break:break-all;
}
.member-answers-box{
  margin-top:10px; padding-top:10px;
  border-top:1px dashed rgba(255,255,255,0.15);
}
.member-answer-row{
  display:flex; justify-content:space-between; gap:10px;
  font-size:12px; padding:5px 0;
  border-bottom:1px solid rgba(255,255,255,0.05);
}
.member-answer-row .mar-label{ color:rgba(255,255,255,0.55); flex-shrink:0; }
.member-answer-row .mar-value{ color:#fff; text-align:left; direction:ltr; }
.admin-permissions-box{
  margin-top:8px; padding-top:8px;
  border-top:1px solid rgba(255,255,255,0.1);
}
.admin-perm-all-row{
  background:rgba(244,208,63,0.08);
  border:1px dashed rgba(244,208,63,0.35);
  border-radius:8px;
  padding:8px;
}
.admin-approve-panel{
  margin-top:8px; padding-top:8px;
  border-top:1px dashed rgba(255,255,255,0.15);
}
.admin-approve-shortcuts{
  display:flex; flex-wrap:wrap; gap:6px;
}
.admin-approve-shortcuts .admin-add-btn{ font-size:11px; padding:6px 10px; }
.admin-country-row span{ flex:1; }
.admin-country-code{
  flex:0 0 auto !important;
  color:rgba(255,255,255,0.55);
  direction:ltr;
}
.profile-soon-badge{
  flex-shrink:0;
  background:var(--q-gold);
  color:#fff;
  font-size:10.5px; font-weight:700;
  padding:4px 10px;
  border-radius:12px;
  white-space:nowrap;
}
.opt-editor{ display:flex; flex-direction:column; gap:6px; margin-bottom:8px; }
.opt-editor-rows{ display:flex; flex-direction:column; gap:6px; }
.opt-editor-row{ display:flex; align-items:center; gap:6px; }
.opt-editor-row input{ flex:1; min-width:0; box-sizing:border-box; margin:0; }
.opt-editor-num{ font-size:12px; opacity:.7; min-width:18px; text-align:center; }
.opt-editor-add{ align-self:flex-start; background:transparent; border:1px dashed rgba(255,255,255,.35); color:inherit; border-radius:8px; padding:6px 12px; font-weight:700; cursor:pointer; font-family:inherit; }
.member-detail-ids{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }
.member-id-chip{ font-size:11.5px; padding:3px 9px; border-radius:999px; background:rgba(124,196,255,.12); color:#9fd3ff; border:1px solid rgba(124,196,255,.3); }
.member-no-tag{ font-size:11px; opacity:.65; margin-inline-start:4px; }
.admin-archive-toggle{ width:100%; margin-top:10px; padding:10px; border-radius:10px; border:1px dashed rgba(255,255,255,.25); background:transparent; color:inherit; font-weight:700; cursor:pointer; font-family:inherit; }
.admin-notif-archive{ margin-top:10px; display:flex; flex-direction:column; gap:8px; }
.admin-archive-month{ font-size:12px; font-weight:800; opacity:.7; margin-top:6px; }
.admin-archive-row{ border:1px solid rgba(255,255,255,.12); border-radius:10px; padding:10px 12px; font-size:13px; line-height:1.6; }
.admin-archive-meta{ display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
.admin-archive-chip{ font-size:11.5px; padding:3px 9px; border-radius:999px; background:rgba(255,255,255,.08); border:1px solid transparent; }
.admin-archive-row > div:first-child{ font-size:14.5px; font-weight:700; color:#fff; }
.chip-time{ color:#b8c2cc; background:rgba(184,194,204,.10); }
.chip-now{ color:#6ee7a8; background:rgba(110,231,168,.12); border-color:rgba(110,231,168,.35); }
.chip-reminder{ color:#fbbf6a; background:rgba(251,191,106,.12); border-color:rgba(251,191,106,.35); }
.chip-audience{ color:#7cc4ff; background:rgba(124,196,255,.12); border-color:rgba(124,196,255,.35); }
.chip-sent{ color:#e9d9a6; background:rgba(233,217,166,.10); }
.chip-delivered{ color:#1a1a1a; background:#f5c542; font-weight:800; }
.chip-muted{ opacity:.55; }
.mer-badge.sub-badge{ padding:2px 8px; font-size:11px; }
.admin-saveundo{ display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; margin:8px 0 4px; padding:8px 10px;
  border-radius:10px; background:rgba(245,196,81,.12); border:1px dashed rgba(245,196,81,.55); }
.admin-saveundo[hidden]{ display:none; }
.asu-note{ font-size:12.5px; font-weight:700; color:#F5C451; font-family:'Cairo',sans-serif; }
.asu-btns{ display:inline-flex; gap:6px; }
.asu-btns button{ padding:6px 12px; border-radius:9px; border:0; font-family:'Cairo',sans-serif; font-size:12.5px; font-weight:800; cursor:pointer; }
.asu-save{ background:#1f7a4c; color:#fff; }
.asu-save:disabled{ opacity:.6; }
.asu-undo{ background:rgba(255,255,255,.12); color:#fff; }
.phrase-bar-host .admin-saveundo{ margin-top:-2px; margin-bottom:10px; }
.fb-ref-chip{ color:#8fd3ff !important; font-weight:800; }
.fb-note-toggle{ margin:10px 0 4px; }
.fb-admin-who{ font-size:12.5px; font-weight:800; color:#F5C451; margin-bottom:4px; word-break:break-all; }
.fb-admin-dev{ font-size:12px; line-height:1.7; background:rgba(143,211,255,.08); border-radius:10px; padding:8px 10px; margin-top:6px; }
.ce-row{ background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:12px; padding:10px; margin-bottom:8px; }
.ce-top{ display:flex; gap:6px; align-items:center; margin-bottom:6px; }
.ce-emoji{ width:52px; flex-shrink:0; text-align:center; }
.ce-label{ flex:1; min-width:0; }
.ce-active{ display:flex; align-items:center; gap:4px; font-size:12.5px; white-space:nowrap; color:#fff; }
.ce-url{ width:100%; box-sizing:border-box; margin-bottom:6px; }
.ce-places{ display:grid; grid-template-columns:1fr 1fr; gap:4px 10px; }
.ce-place{ display:flex; align-items:center; gap:6px; font-size:12.5px; color:rgba(255,255,255,.85); }
.mer-badge.mer-new{ background:rgba(226,75,74,.16); color:#ff9a9a; }
.admin-new-dot{ font-size:12px; }
/* (8.2) أسماء الأدمن + مين اتصرف */
.staff-row{ background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:12px; padding:10px; margin-bottom:8px; }
.staff-top{ display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap; font-size:12.5px; margin-bottom:4px; }
.staff-role{ font-weight:900; color:#F5C451; }
.staff-email{ color:rgba(255,255,255,.7); word-break:break-all; }
.staff-member{ font-size:12px; color:rgba(255,255,255,.6); margin-bottom:6px; }
.staff-name{ width:100%; box-sizing:border-box; }
.act-by{ font-size:12px; color:#9fd8b8; margin:-4px 0 10px; }
.act-chip{ color:#9fd8b8 !important; }
.mer-badge.mer-wait{ background:rgba(245,196,81,.16); color:#F5C451; }
/* (8.3) كارت الأدمن: بيانات + صلاحيات + آخر إجراء + سجل آخر أسبوعين */
.staff-perms{ display:flex; flex-wrap:wrap; gap:4px; align-items:center; font-size:12px; margin-bottom:6px; }
.staff-perm{ background:rgba(143,211,255,.12); color:#8fd3ff; border-radius:999px; padding:2px 8px; font-size:11.5px; font-weight:700; }
.staff-perm.all{ background:rgba(245,196,81,.16); color:#F5C451; }
.staff-perm.none{ background:rgba(255,255,255,.08); color:rgba(255,255,255,.6); }
.staff-last{ font-size:12px; color:#9fd8b8; margin-bottom:8px; line-height:1.7; }
.staff-last-det{ color:rgba(255,255,255,.6); }
.staff-actions{ display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
.staff-btn{ padding:6px 10px; border-radius:9px; border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.06); color:#fff;
  font-family:'Cairo',sans-serif; font-size:12px; font-weight:800; cursor:pointer; }
.staff-log{ margin-top:8px; background:rgba(0,0,0,.18); border-radius:10px; padding:8px 10px; max-height:260px; overflow-y:auto; }
.staff-log[hidden]{ display:none; }
.staff-log-day{ font-size:11.5px; font-weight:900; color:#F5C451; margin:6px 0 2px; }
.staff-log-row{ display:flex; gap:8px; align-items:baseline; font-size:12px; line-height:1.7; padding:2px 0; border-bottom:1px solid rgba(255,255,255,.05); }
.staff-log-time{ color:rgba(255,255,255,.55); flex-shrink:0; }
.staff-log-act{ font-weight:800; color:#fff; flex-shrink:0; }
.staff-log-det{ color:rgba(255,255,255,.65); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
/* (و) أداة الصور والروابط في لوحة الأدمن + جمل الترحيب */
.media-editor .me-row, .media-editor .me-img-row{ display:flex; gap:6px; align-items:center; margin-bottom:6px; }
.media-editor .me-link-title{ flex:1; min-width:0; }
.media-editor .me-link-url{ flex:1.6; min-width:0; }
.media-editor .me-img-url{ flex:1; min-width:0; }
.me-thumb{ width:52px; height:52px; object-fit:cover; border-radius:8px; flex-shrink:0; background:rgba(255,255,255,.06); }
.me-img-name{ flex:1; min-width:0; font-size:12px; opacity:.8; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.me-bad .me-img-url{ border-color:#ff8f8f !important; }
.me-add-row{ display:flex; gap:6px; flex-wrap:wrap; }
.me-add{ padding:7px 12px; border-radius:10px; border:1px dashed rgba(255,255,255,.3); background:rgba(255,255,255,.04);
  color:#fff; font-family:'Cairo',sans-serif; font-size:12.5px; font-weight:700; cursor:pointer; margin-bottom:8px; }
.phrase-row{ display:flex; gap:6px; align-items:flex-start; margin-bottom:6px; }
.phrase-row textarea{ flex:1; min-width:0; }
.phrase-row.off textarea{ opacity:.5; }
.admin-row2{ display:flex; gap:8px; }
.admin-row2 > div{ flex:1; min-width:0; }
.admin-archive-actions{ display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.admin-archive-actions button{ padding:5px 10px; border-radius:8px; border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.05);
  color:#fff; font-size:12px; font-weight:700; cursor:pointer; font-family:'Cairo',sans-serif; }
.admin-archive-row.is-hidden{ opacity:.6; }
.chip-hidden{ color:#c9c9c9; border-color:rgba(255,255,255,.25); }
.chip-cancelled{ color:#ff9a9a; background:rgba(255,120,120,.1); border-color:rgba(255,120,120,.35); }
.chip-validity{ color:#a8e6b8; background:rgba(120,220,150,.08); border-color:rgba(120,220,150,.3); }
.admin-storage-line{ font-size:12px; opacity:.8; }
.admin-subsection{ margin-top:18px; padding-top:12px; border-top:1px dashed rgba(255,255,255,.18); }
/* (9.1) سطر نسخة ملف الإدارة تحت عنوان اللوحة */
.admin-js-version{ font-size:11px; color:var(--ink-soft); opacity:.7; margin:4px 0 0; }
/* (1.1) بند 44 (1): تبديل الأجهزة */
#devSwitchRefresh{ margin-bottom:10px; }
.dev-acc{ background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; margin-bottom:6px; font-family:'Cairo',sans-serif; color:#fff; }
.dev-acc-head{ display:flex; align-items:center; gap:8px; width:100%; background:none; border:none; color:inherit; font:inherit; font-size:12.5px; padding:12px 14px; cursor:pointer; text-align:start; }
.dev-acc-who{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; direction:ltr; text-align:right; }
.dev-acc-count{ flex-shrink:0; font-size:11px; font-weight:700; padding:3px 8px; border-radius:8px; background:rgba(124,196,255,.12); color:#9fd3ff; }
.dev-acc-sub{ padding:0 14px 10px; font-size:11.5px; opacity:.8; }
.dev-acc-rows{ display:none; padding:0 14px 12px; }
.dev-acc.open .dev-acc-rows{ display:block; }
.dev-row{ display:flex; flex-wrap:wrap; gap:6px 10px; align-items:center; padding:7px 0; border-top:1px solid rgba(255,255,255,0.08); font-size:11.5px; }
.dev-row-time{ direction:ltr; opacity:.75; }
.dev-row-label{ flex:1; min-width:120px; direction:ltr; text-align:right; overflow-wrap:anywhere; }
.dev-row .mer-badge{ font-size:10px; font-weight:700; padding:3px 8px; border-radius:8px; }
.dev-row .dev-known{ background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.75); }
/* (1.3) المسح والاختلافات والاختصارات */
.admin-wipe-box{ margin-top:10px; padding:10px; border:1px solid rgba(255,154,154,0.25); border-radius:10px; background:rgba(255,154,154,0.05); }
.admin-wipe-box .admin-member-actions{ margin-top:0; }
.admin-wipe-orders{ margin-top:8px; }
.admin-wipe-row{ font-size:11.5px; line-height:1.7; padding:7px 0; border-top:1px solid rgba(255,255,255,0.08); color:#fff; overflow-wrap:anywhere; }
.admin-wipe-name{ font-weight:700; direction:ltr; text-align:right; }
.admin-wipe-status{ opacity:.85; }
.admin-wipe-empty{ font-size:11.5px; opacity:.7; padding:6px 0; }
/* (1.4) صندوق الحسابات اللي على نفس الأجهزة، وشارتين المنتهي والمحظور في الكارت */
.admin-peers-box{ margin-top:10px; padding:10px; border:1px solid rgba(124,196,255,.3); border-radius:10px; background:rgba(124,196,255,.06); }
.admin-peers-title{ font-size:12.5px; font-weight:800; color:#7cc4ff; margin-bottom:2px; }
.admin-peers-note{ font-size:11.5px; opacity:.8; margin-top:6px; }
.admin-peers-box .admin-add-btn{ margin-top:4px; }
.sub-badge.nd-exp{ background:rgba(245,196,81,.16); color:#F5C451; }
.sub-badge.nd-ban{ background:rgba(226,75,74,.16); color:#ff9a9a; }
.admin-wipe-all{ margin-top:14px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.12); }
.admin-wipe-all-title{ font-size:12.5px; font-weight:700; margin-bottom:8px; color:#fff; }
#adminWipeAllRefresh, #bankChecksRefresh{ margin-bottom:10px; }
.admin-shortcut-row{ font-size:12px; line-height:1.8; color:#fff; margin-bottom:8px; }
`;async function sendRealPushNotification(title,body,opts){opts=opts||{};if(!supabaseClient)throw new Error("لا يوجد اتصال بالخادم");const token=await getFreshAccessToken();const res=await withTimeout(fetch(`${SUPABASE_URL}/functions/v1/send-push`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({title,body,user_ids:opts.userIds||undefined,audience:opts.audience||"members",notification_id:opts.notificationId||undefined,}),}),15000,"إرسال الإشعار");let out={};try{out=await res.json();}catch(e){}if(!res.ok)throw new Error(out.error||`HTTP ${res.status}`);return out;}function createMediaEditor(container,opts){if(!container)return null;const MAX=6;const bucket=opts.bucket;container.classList.add("media-editor");container.innerHTML=`
    <label class="admin-label">🔗 روابط (اختياري)</label>
    <div class="me-links"></div>
    <button type="button" class="me-add" data-add="link">+ إضافة رابط</button>
    <label class="admin-label">🖼️ صور (اختياري — لحد ${MAX})</label>
    <div class="me-images"></div>
    <div class="me-add-row">
      <button type="button" class="me-add" data-add="files">+ صور من الجهاز</button>
      <button type="button" class="me-add" data-add="imglink">+ رابط صورة (درايف)</button>
    </div>
    <input type="file" accept="image/*" multiple class="me-file" hidden>
    <span class="ag-note">صور الجهاز بتتصغّر قبل الرفع. صورة درايف لازم تكون متشاركة "أي حد معاه الرابط"، ومابتاخدش من مساحتنا.</span>
    <label class="admin-label">🎬 فيديو (اختياري — يوتيوب أو جوجل درايف)</label>
    <input type="url" class="admin-textarea me-video" dir="ltr" placeholder="https://youtu.be/...">`;const linksBox=container.querySelector(".me-links");const imagesBox=container.querySelector(".me-images");const fileInput=container.querySelector(".me-file");const videoInput=container.querySelector(".me-video");let items=[];let removedSaved=[];function addLinkRow(title,url){const row=document.createElement("div");row.className="me-row";row.innerHTML=`<input type="text" class="admin-input me-link-title" placeholder="العنوان (اختياري)">
      <input type="url" class="admin-input me-link-url" dir="ltr" placeholder="https://...">
      <button type="button" class="admin-url-remove" aria-label="حذف">✕</button>`;row.querySelector(".me-link-title").value=title||"";row.querySelector(".me-link-url").value=url||"";row.querySelector("button").addEventListener("click",()=>row.remove());linksBox.appendChild(row);return row;}function renderImages(){imagesBox.innerHTML="";items.forEach((it,idx)=>{const row=document.createElement("div");row.className="me-img-row";if(it.kind==="file"){row.innerHTML=`<img class="me-thumb" src="${it.preview}" alt=""><span class="me-img-name">${ndEscape(it.file.name)}</span>`;}else if(it.kind==="saved"){row.innerHTML=`<img class="me-thumb" src="${ndEscape(it.img.url)}" alt=""><span class="me-img-name">صورة محفوظة</span>`;}else{row.innerHTML=`<input type="url" class="admin-input me-img-url" dir="ltr" placeholder="رابط الصورة (درايف أو مباشر)"><img class="me-thumb" alt="" hidden>`;const inp=row.querySelector(".me-img-url"),th=row.querySelector(".me-thumb");inp.value=it.url||"";const preview=()=>{it.url=inp.value.trim();const im=ndImageFromLink(it.url);th.onerror=()=>{th.hidden=true;row.classList.add("me-bad");showToast(`⚠️ صورة مش بتحمّل — اتأكد إنها متشاركة "أي حد معاه الرابط"`,3500);};th.onload=()=>{th.hidden=false;row.classList.remove("me-bad");};if(im)th.src=im.url;else th.hidden=true;};inp.addEventListener("change",preview);inp.addEventListener("input",()=>{it.url=inp.value.trim();});if(it.url)preview();}const del=document.createElement("button");del.type="button";del.className="admin-url-remove";del.textContent="✕";del.addEventListener("click",()=>{if(it.kind==="file"&&it.preview)URL.revokeObjectURL(it.preview);if(it.kind==="saved"&&it.img&&it.img.path)removedSaved.push(it.img.path);items.splice(idx,1);renderImages();});row.appendChild(del);imagesBox.appendChild(row);});}container.querySelector('[data-add="link"]').addEventListener("click",()=>addLinkRow("","").querySelector(".me-link-url").focus());container.querySelector('[data-add="files"]').addEventListener("click",()=>fileInput.click());container.querySelector('[data-add="imglink"]').addEventListener("click",()=>{if(items.length>=MAX){showToast(`⚠️ الحد الأقصى ${MAX} صور`,2500);return;}items.push({kind:"link",url:""});renderImages();const ins=imagesBox.querySelectorAll(".me-img-url");if(ins.length)ins[ins.length-1].focus();});fileInput.addEventListener("change",()=>{let skipped=0;Array.from(fileInput.files||[]).forEach(f=>{if(items.length<MAX)items.push({kind:"file",file:f,preview:URL.createObjectURL(f)});else skipped++;});if(skipped)showToast(`⚠️ الحد الأقصى ${MAX} صور`,2500);fileInput.value="";renderImages();});const api={getLinks(){return Array.from(linksBox.querySelectorAll(".me-row")).map(r=>({title:r.querySelector(".me-link-title").value.trim()||null,url:r.querySelector(".me-link-url").value.trim(),})).filter(l=>l.url);},getVideo(){const v=videoInput.value.trim();return v||null;},validate(){const bad=api.getLinks().find(l=>!ndIsHttpUrl(l.url));if(bad)return{ok:false,error:`الرابط ده مش صحيح (لازم يبدأ بـ https://): ${bad.url}`};const badImg=items.find(it=>it.kind==="link"&&it.url&&!ndImageFromLink(it.url));if(badImg)return{ok:false,error:`رابط الصورة ده مش صحيح: ${badImg.url}`};const v=api.getVideo();if(v&&!ndIsHttpUrl(v))return{ok:false,error:"رابط الفيديو لازم يبدأ بـ https://"};return{ok:true};},async buildImages(prefix,onProgress){const images=[],uploaded=[];const total=items.filter(it=>it.kind==="file").length;let n=0;try{for(const it of items){if(it.kind==="saved")images.push(it.img);else if(it.kind==="link"){const im=it.url?ndImageFromLink(it.url):null;if(im)images.push(im);}else{n++;if(onProgress)onProgress(n,total);const{blob,w,h}=await ndCompressImageFile(it.file);const path=`${prefix}/${Date.now()}-${n}.jpg`;const{error}=await supabaseClient.storage.from(bucket).upload(path,blob,{contentType:"image/jpeg",cacheControl:"31536000",upsert:false});if(error)throw new Error(`رفع الصورة ${n}: ${error.message}`);const{data:pub}=supabaseClient.storage.from(bucket).getPublicUrl(path);const rec={path,url:pub.publicUrl,w,h,size:blob.size};uploaded.push(rec);images.push(rec);}}}catch(e){e.uploaded=uploaded;throw e;}return{images,uploaded};},async removeUploaded(list){const paths=(list||[]).map(x=>x&&x.path).filter(Boolean);if(paths.length){try{await supabaseClient.storage.from(bucket).remove(paths);}catch(e){}}},async removeDeletedSaved(){if(removedSaved.length){await api.removeUploaded(removedSaved.map(p=>({path:p})));removedSaved=[];}},setValue(v){api.reset();(v.links||[]).forEach(l=>addLinkRow(typeof l==="string"?"":(l.title||""),typeof l==="string"?l:l.url));(v.images||[]).forEach(im=>items.push({kind:"saved",img:typeof im==="string"?{url:im}:im}));videoInput.value=v.video_url||"";renderImages();},reset(){items.forEach(it=>{if(it.kind==="file"&&it.preview)URL.revokeObjectURL(it.preview);});items=[];removedSaved=[];linksBox.innerHTML="";videoInput.value="";renderImages();},};return api;}function renderAdminUrlList(containerId,arr,onRemove){const el=document.getElementById(containerId);if(!el)return;el.innerHTML="";arr.forEach((url,i)=>{const row=document.createElement("div");row.className="admin-url-row";row.innerHTML=`<span>${ndEscape(url)}</span><button class="admin-url-remove" aria-label="حذف">✕</button>`;row.querySelector(".admin-url-remove").addEventListener("click",()=>onRemove(i));el.appendChild(row);});}function renderAdminPanel(){document.querySelectorAll("#adminSectionsList [data-perm]").forEach(section=>{const perms=(section.dataset.perm||"").split(/\s+/).filter(Boolean);const allowed=(ND.currentUserRole==="owner")||perms.some(p=>ND.currentUserPermissions.includes(p));section.style.display=allowed?"":"none";});const versionNote=document.getElementById("versionStatusNote");const publishBtn=document.getElementById("publishVersionBtn");if(versionNote&&supabaseClient){supabaseClient.from("app_settings").select("value").eq("key","required_app_version").maybeSingle().then(({data})=>{const liveRequired=data&&data.value?parseFloat(data.value):1;if(liveRequired>=APP_VERSION){versionNote.textContent=`✅ الملف ده (إصدار ${APP_VERSION_LABEL}) هو المنشور حاليًا على الكل.`;if(publishBtn)publishBtn.disabled=true;}else{versionNote.textContent=`⚠️ المنشور حاليًا إصدار ${liveRequired}. الملف اللي بين إيديك إصدار ${APP_VERSION_LABEL} (أحدث) — دوس نشر عشان تفرضه على كل الأجهزة.`;if(publishBtn)publishBtn.disabled=false;}});}const rcInput=document.getElementById("recomputeCycleInput");if(rcInput)rcInput.value=ND.recomputeCycleDays;renderMotivAdmin();loadAdminNames().then(()=>{try{renderFeedbackAdmin();}catch(e){}});renderStaffNames();renderFeedbackAdmin();buildContactEditor();refreshAdminBadges(true);const welcomeEl=document.getElementById("adminWelcomeText");if(welcomeEl)welcomeEl.value=ND.welcomeMessageText||"";renderAdminComingSoonList();renderAdminSignupIntro();renderAdminFieldsList();renderAdminCountriesList();renderAdminMembersList();}const MOTIV_SITUATIONS=[{key:"guest",label:"👤 الزائر",help:"بتظهر للزائر اللي داخل من غير حساب."},{key:"first_day",label:"🌱 أول يوم للعضو",help:"أول يوم بعد إنشاء الحساب."},{key:"streak",label:"🔥 أيام مكتملة متتالية",help:"اكتب {ترتيب_اليوم} ← بتتحوّل لـ (الثاني، الثالث...). اليوم المكتمل = 10 أسئلة."},{key:"milestone",label:"🏆 محطات مميزة",help:"بتظهر عند 7، 14، 21، 30، 40، 50، 60، 90، 100، 150، 200، 365 يوم مكتمل متتالي. اكتب {المدة} ← (7 أيام، 14 يومًا...)."},{key:"absent_1",label:"🌙 غاب امبارح",help:"ماحلّش ولا سؤال امبارح."},{key:"absent_n",label:"💭 غاب أكتر من يوم",help:"اكتب {المدة} ← (يومين، 3 أيام، 15 يومًا...)."},{key:"partial_yesterday",label:"⏳ حل امبارح وماكمّلش العشرة",help:"حل أسئلة امبارح بس أقل من 10."},{key:"done_today",label:"✅ كمّل عشرة النهاردة",help:"لو فتح التطبيق تاني بعد ما كمّل المطلوب."},{key:"general",label:"✨ عامة",help:"لأي حالة تانية، وبتُستخدم كمان لو حالة مالهاش جمل."},];let motivAdmin={messages:[],phrases:[],rotation:{mode:"rotate",every_days:1},editingId:null,media:null};async function renderMotivAdmin(){const list=document.getElementById("motivAdminList");if(!list||!supabaseClient)return;list.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;const[m,r,p]=await Promise.all([supabaseClient.from("motivation_messages").select("*").order("sort_order").order("created_at"),supabaseClient.from("app_settings").select("value").eq("key","motivation_rotation").maybeSingle(),supabaseClient.from("motivation_phrases").select("*").order("created_at"),]);if(m.error){list.innerHTML=`<div class="auth-field-help">معرفتش أحمّل الرسائل</div>`;return;}motivAdmin.messages=m.data||[];try{if(r&&r.data&&r.data.value)motivAdmin.rotation=JSON.parse(r.data.value);}catch(e){}motivAdmin.phrases=(p&&p.data)||[];const modeSel=document.getElementById("motivRotMode");const everySel=document.getElementById("motivRotEvery");if(modeSel)modeSel.value=motivAdmin.rotation.mode==="fixed"?"fixed":"rotate";if(everySel)everySel.value=String(motivAdmin.rotation.every_days||1);syncMotivRotUI();renderMotivAdminList();renderPhraseAdmin();}function syncMotivRotUI(){const modeSel=document.getElementById("motivRotMode");const wrap=document.getElementById("motivRotEveryWrap");if(modeSel&&wrap)wrap.style.visibility=modeSel.value==="rotate"?"visible":"hidden";}function renderMotivAdminList(){const list=document.getElementById("motivAdminList");if(!list)return;const saved=ND.motivData;ND.motivData={messages:motivAdmin.messages.filter(x=>x.is_active),phrases:saved.phrases,rotation:motivAdmin.rotation};const shown=pickMotivationMessage();ND.motivData=saved;const rot=motivAdmin.rotation;list.innerHTML=motivAdmin.messages.length?"":`<div class="auth-field-help">لسه مفيش رسائل</div>`;motivAdmin.messages.forEach(msg=>{const chips=[];if(!msg.is_active)chips.push(`<span class="admin-archive-chip chip-hidden">⏸️ موقوفة</span>`);if(shown&&shown.id===msg.id)chips.push(`<span class="admin-archive-chip chip-delivered">👁️ ظاهرة النهاردة</span>`);if(rot.mode==="fixed"&&rot.fixed_id===msg.id)chips.push(`<span class="admin-archive-chip chip-validity">📌 الثابتة</span>`);if(msg.show_from||msg.show_until)chips.push(`<span class="admin-archive-chip chip-reminder">📅 ${msg.show_from||"من الأول"} ← ${msg.show_until||"مفتوحة"}</span>`);const media=ndMediaBadges({images:msg.images,video_url:msg.video_url,links:msg.links});if(media)chips.push(`<span class="admin-archive-chip">${media}</span>`);const card=document.createElement("div");card.className="admin-archive-row"+(msg.is_active?"":" is-hidden");card.innerHTML=`<div style="white-space:pre-wrap;">${ndEscape(msg.text)}</div>
      <div class="admin-archive-meta">${chips.join("")}</div>
      <div class="admin-archive-actions">
        <button type="button" data-ma="edit">✏️ تعديل</button>
        <button type="button" data-ma="toggle">${msg.is_active?"⏸️ إيقاف":"▶️ تفعيل"}</button>
        ${msg.is_active&&!(msg.show_from||msg.show_until)&&!(rot.mode==="fixed"&&rot.fixed_id===msg.id)?`<button type="button" data-ma="pin">📌 اجعلها الثابتة</button>`:""}
        <button type="button" data-ma="delete">✅ تمت بفضل الله</button>
      </div>`;card.querySelectorAll("[data-ma]").forEach(b=>b.addEventListener("click",()=>motivAdminAction(b.dataset.ma,msg)));list.appendChild(card);});}async function saveMotivRotation(rot){const{error}=await supabaseClient.from("app_settings").upsert({key:"motivation_rotation",value:JSON.stringify(rot),updated_at:new Date().toISOString()});if(error)throw error;motivAdmin.rotation=rot;}async function motivAdminAction(act,msg){try{if(act==="edit"){openMotivEditor(msg);return;}if(act==="toggle"){const{error}=await supabaseClient.from("motivation_messages").update({is_active:!msg.is_active,updated_at:new Date().toISOString()}).eq("id",msg.id);if(error)throw error;}else if(act==="pin"){await saveMotivRotation({mode:"fixed",fixed_id:msg.id,every_days:motivAdmin.rotation.every_days||1});showToast("📌 بقت الرسالة الثابتة",2500);}else if(act==="delete"){if(!window.confirm("✅ تمت بفضل الله: الرسالة هتتشال نهائيًا هي وصورها، ومفيش رجوع. تكمّل؟"))return;const paths=(msg.images||[]).filter(im=>im&&im.path).map(im=>im.path);if(paths.length){try{await supabaseClient.storage.from("motivation-media").remove(paths);}catch(e){}}const{error}=await supabaseClient.from("motivation_messages").delete().eq("id",msg.id);if(error)throw error;showToast("✅ تمت بفضل الله، واتشالت الرسالة",3000);}await renderMotivAdmin();refreshMotivData();}catch(e){showGlobalError("الرسائل التحفيزية",e);}}function openMotivEditor(msg){const ed=document.getElementById("motivEditor");if(!ed)return;motivAdmin.editingId=msg?msg.id:null;document.getElementById("motivEdTitle").textContent=msg?"✏️ تعديل الرسالة":"رسالة جديدة";document.getElementById("motivEdText").value=msg?(msg.text||""):"";document.getElementById("motivEdFrom").value=msg&&msg.show_from?msg.show_from:"";document.getElementById("motivEdUntil").value=msg&&msg.show_until?msg.show_until:"";if(motivAdmin.media){if(msg)motivAdmin.media.setValue(msg);else motivAdmin.media.reset();}ed.style.display="block";try{ed.scrollIntoView({behavior:"smooth",block:"start"});}catch(e){}}function closeMotivEditor(){const ed=document.getElementById("motivEditor");if(ed)ed.style.display="none";motivAdmin.editingId=null;if(motivAdmin.media)motivAdmin.media.reset();}async function saveMotivEditor(){const btn=document.getElementById("motivEdSave");const text=(document.getElementById("motivEdText").value||"").trim();if(!text){showGlobalError("الرسائل التحفيزية","اكتب نص الرسالة");return;}const mv=motivAdmin.media?motivAdmin.media.validate():{ok:true};if(!mv.ok){showGlobalError("الرسائل التحفيزية",mv.error);return;}const from=document.getElementById("motivEdFrom").value||null;const until=document.getElementById("motivEdUntil").value||null;if(from&&until&&until<from){showGlobalError("الرسائل التحفيزية","تاريخ النهاية قبل تاريخ البداية");return;}const id=motivAdmin.editingId||ndNewId();btn.disabled=true;let built=null;try{built=motivAdmin.media?await motivAdmin.media.buildImages(id,(i,n)=>{btn.textContent=`⏳ بيرفع الصور (${i}/${n})...`;}):{images:[],uploaded:[]};const row={text,images:built.images,links:motivAdmin.media?motivAdmin.media.getLinks():[],video_url:motivAdmin.media?motivAdmin.media.getVideo():null,show_from:from,show_until:until,updated_at:new Date().toISOString(),};const q=motivAdmin.editingId?supabaseClient.from("motivation_messages").update(row).eq("id",id):supabaseClient.from("motivation_messages").insert(Object.assign({id,sort_order:motivAdmin.messages.length},row));const{error}=await q;if(error)throw error;if(motivAdmin.media)await motivAdmin.media.removeDeletedSaved();closeMotivEditor();showToast("✅ اتحفظت الرسالة",2500);await renderMotivAdmin();refreshMotivData();}catch(e){const up=(e&&e.uploaded)||(built&&built.uploaded)||[];if(up.length&&motivAdmin.media)await motivAdmin.media.removeUploaded(up);showGlobalError("الرسائل التحفيزية",e);}finally{btn.disabled=false;btn.textContent="💾 حفظ الرسالة";}}function renderPhraseAdmin(){const sel=document.getElementById("phraseSituation");const listEl=document.getElementById("phraseList");const help=document.getElementById("phraseHelp");if(!sel||!listEl)return;const current=sel.value||MOTIV_SITUATIONS[0].key;sel.innerHTML=MOTIV_SITUATIONS.map(x=>{const n=motivAdmin.phrases.filter(p=>p.situation===x.key&&p.is_active).length;return`<option value="${x.key}">${x.label} (${n})</option>`;}).join("");sel.value=current;const sit=MOTIV_SITUATIONS.find(x=>x.key===sel.value)||MOTIV_SITUATIONS[0];if(help)help.textContent=(sit.help?sit.help+" ":"")+"وتقدر تكتب {الاسم} كمان.";const items=motivAdmin.phrases.filter(p=>p.situation===sit.key);listEl.innerHTML=items.length?"":`<div class="auth-field-help">مفيش جمل للحالة دي — هتُستخدم الجمل العامة</div>`;items.forEach(p=>{const row=document.createElement("div");row.className="phrase-row"+(p.is_active?"":" off");row.innerHTML=`<textarea class="admin-textarea" rows="2"></textarea>
      <label class="admin-checkbox-row" title="مفعّلة"><input type="checkbox" ${p.is_active?"checked":""}></label>
      <button type="button" class="admin-url-remove" aria-label="تمت بفضل الله" title="تمت بفضل الله">✅</button>`;const ta=row.querySelector("textarea");ta.value=p.text;const barHost=document.createElement("div");barHost.className="phrase-bar-host";const bar=createAdminSaveBar(barHost,{isDirty:()=>ta.value!==p.text,onUndo:()=>{ta.value=p.text;},onSave:async()=>{const t=ta.value.trim();if(!t){showGlobalError("جمل الترحيب","الجملة ماينفعش تبقى فاضية");return false;}const{error}=await supabaseClient.from("motivation_phrases").update({text:t}).eq("id",p.id);if(error){showGlobalError("جمل الترحيب",error);return false;}p.text=t;ta.value=t;refreshMotivData();return true;},});ta.addEventListener("input",bar.refresh);row.querySelector("input[type=checkbox]").addEventListener("change",async(e)=>{const{error}=await supabaseClient.from("motivation_phrases").update({is_active:e.target.checked}).eq("id",p.id);if(error){showGlobalError("جمل الترحيب",error);e.target.checked=!e.target.checked;return;}p.is_active=e.target.checked;showToast(e.target.checked?"✅ الجملة اتفعّلت":"⏸️ الجملة اتوقفت",1800);renderPhraseAdmin();refreshMotivData();});row.querySelector(".admin-url-remove").addEventListener("click",async()=>{if(!window.confirm("✅ تمت بفضل الله: الجملة دي هتتشال من جمل الترحيب. تكمّل؟"))return;const{error}=await supabaseClient.from("motivation_phrases").delete().eq("id",p.id);if(error){showGlobalError("جمل الترحيب",error);return;}motivAdmin.phrases=motivAdmin.phrases.filter(x=>x.id!==p.id);showToast("✅ تمت بفضل الله، واتشالت الجملة",2500);renderPhraseAdmin();refreshMotivData();});listEl.appendChild(row);listEl.appendChild(barHost);});}async function addMotivPhrase(){const sel=document.getElementById("phraseSituation");const ta=document.getElementById("phraseNewText");const text=(ta.value||"").trim();if(!text||!sel)return;const{data,error}=await supabaseClient.from("motivation_phrases").insert({situation:sel.value,text}).select().single();if(error){showGlobalError("جمل الترحيب",error);return;}ta.value="";motivAdmin.phrases.push(data);renderPhraseAdmin();refreshMotivData();showToast("✅ اتضافت الجملة",1800);}function setupMotivAdmin(){motivAdmin.media=createMediaEditor(document.getElementById("motivEdMedia"),{bucket:"motivation-media"});const modeSel=document.getElementById("motivRotMode");if(modeSel)modeSel.addEventListener("change",syncMotivRotUI);const rotSave=document.getElementById("motivRotSave");if(rotSave)rotSave.addEventListener("click",async()=>{try{const mode=modeSel.value;const every=parseInt(document.getElementById("motivRotEvery").value,10)||1;let fixedId=motivAdmin.rotation.fixed_id||null;if(mode==="fixed"&&!motivAdmin.messages.some(m=>m.id===fixedId&&m.is_active)){const first=motivAdmin.messages.find(m=>m.is_active&&!m.show_from&&!m.show_until);fixedId=first?first.id:null;if(fixedId)showToast("📌 اتثبّتت أول رسالة — تقدر تغيّرها من زرار \"اجعلها الثابتة\"",4000);}await saveMotivRotation({mode,every_days:every,fixed_id:fixedId});showToast("✅ اتحفظت طريقة الظهور",2500);await renderMotivAdmin();refreshMotivData();}catch(e){showGlobalError("الرسائل التحفيزية",e);}});const newBtn=document.getElementById("motivNewBtn");if(newBtn)newBtn.addEventListener("click",()=>openMotivEditor(null));const edSave=document.getElementById("motivEdSave");if(edSave)edSave.addEventListener("click",saveMotivEditor);const edCancel=document.getElementById("motivEdCancel");if(edCancel)edCancel.addEventListener("click",closeMotivEditor);const sitSel=document.getElementById("phraseSituation");if(sitSel)sitSel.addEventListener("change",renderPhraseAdmin);const addBtn=document.getElementById("phraseAddBtn");if(addBtn)addBtn.addEventListener("click",addMotivPhrase);}let fbAdminItems=[];async function renderFeedbackAdmin(){const list=document.getElementById("fbAdminList");if(!list||!supabaseClient)return;list.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;const[{data,error},setRes]=await Promise.all([supabaseClient.rpc("admin_list_feedback"),supabaseClient.from("app_settings").select("key, value").in("key",["feedback_moderation","feedback_show_hidden_note","feedback_show_published_note"]),]);const sel=document.getElementById("fbModeSel");const noteCb=document.getElementById("fbHiddenNoteCb");const pubCb=document.getElementById("fbPublishedNoteCb");(setRes&&setRes.data||[]).forEach(r=>{if(r.key==="feedback_moderation"&&sel&&r.value)sel.value=r.value;if(r.key==="feedback_show_hidden_note"&&noteCb)noteCb.checked=r.value==="on";if(r.key==="feedback_show_published_note"&&pubCb)pubCb.checked=r.value==="on";});if(error){list.innerHTML=`<div class="auth-field-help">${ndEscape(adminErrText(error).replace("معرفتش أحفظ","معرفتش أحمّل الرسائل"))}</div>`;return;}fbAdminItems=data||[];fbRenderAdminList();}function fbRenderAdminList(){const list=document.getElementById("fbAdminList");if(!list)return;const f=(document.getElementById("fbAdminFilter")||{}).value||"all";const fsel=document.getElementById("fbAdminFilter");if(fsel){const cnt={all:fbAdminItems.length,problem_open:fbAdminItems.filter(x=>x.kind==="problem"&&!x.done).length,pending:fbAdminItems.filter(x=>x.status==="pending").length,suggestion:fbAdminItems.filter(x=>x.kind==="suggestion").length,hidden:fbAdminItems.filter(x=>x.status==="hidden").length,done:fbAdminItems.filter(x=>x.done).length};const base={all:"الكل",problem_open:"🛠️ مشاكل فنية مفتوحة",pending:"⏳ في انتظار الموافقة",suggestion:"💡 الاقتراحات والآراء",hidden:"🙈 المخفية",done:"✅ تمت بفضل الله"};Array.from(fsel.options).forEach(o=>{o.textContent=`${base[o.value]} (${cnt[o.value]||0})`;});}const q=((document.getElementById("fbAdminSearch")||{}).value||"").trim().replace(/^#/,"").toLowerCase();const items=fbAdminItems.filter(x=>f==="all"?true:f==="problem_open"?(x.kind==="problem"&&!x.done):f==="pending"?x.status==="pending":f==="suggestion"?x.kind==="suggestion":f==="hidden"?x.status==="hidden":f==="done"?x.done:true).filter(x=>!q||[x.ref,x.email,x.author_name,x.member_no].some(v=>String(v||"").toLowerCase().includes(q)));if(!items.length){list.innerHTML=`<div class="auth-field-help">مفيش رسائل هنا</div>`;return;}const fmt=(iso)=>{const x=new Date(iso);return`${x.getDate()}/${x.getMonth()+1} — ${String(x.getHours()).padStart(2,"0")}:${String(x.getMinutes()).padStart(2,"0")}`;};list.innerHTML="";items.forEach(it=>{const chips=[`<span class="admin-archive-chip">${it.kind==="problem"?"🛠️ مشكلة فنية":"💡 اقتراح"}</span>`,...(it.ref?[`<span class="admin-archive-chip fb-ref-chip" dir="ltr">#${ndEscape(it.ref)}</span>`]:[]),`<span class="admin-archive-chip">🕒 ${fmt(it.created_at)}</span>`,];if(it.kind==="suggestion"){chips.push(`<span class="admin-archive-chip">👍 ${it.votes||0}</span>`);if(it.status==="pending")chips.push(`<span class="admin-archive-chip chip-reminder">⏳ مستنية موافقة</span>`);if(it.status==="hidden")chips.push(`<span class="admin-archive-chip chip-hidden">🙈 مخفية</span>`);}if(it.done)chips.push(`<span class="admin-archive-chip chip-delivered">✅ تمت</span>`);if(it.acted_by){const what={done:"✅ تمت بواسطة",undone:"↩️ ألغى «تمت»",hidden:"🙈 أخفاها",visible:"👁️ أظهرها"}[it.acted_what]||"✏️ آخر إجراء";chips.push(`<span class="admin-archive-chip act-chip">${what}: ${ndEscape(adminNameOf(it.acted_by))} · <bdi dir="ltr">${fmtActTime(it.acted_at)}</bdi></span>`);}const dev=it.kind==="problem"&&it.device?`<div class="fb-admin-dev">${fbDeviceLines(it.device).map(([k,v])=>`<div><b>${ndEscape(k)}:</b> <span dir="auto">${ndEscape(v)}</span></div>`).join("")}</div>`:"";const acts=[];if(it.kind==="suggestion"){if(it.status==="pending")acts.push(`<button type="button" data-fa="publish">✅ نشر</button>`);if(it.status==="visible")acts.push(`<button type="button" data-fa="hide">🙈 إخفاء</button>`);if(it.status==="hidden")acts.push(`<button type="button" data-fa="show">👁️ إظهار</button>`);}acts.push(it.done?`<button type="button" data-fa="undone">↩️ إلغاء "تمت"</button>`:`<button type="button" data-fa="done">✅ تمت بفضل الله</button>`);if(it.kind==="problem")acts.push(`<button type="button" data-fa="copy">📋 نسخ</button>`);acts.push(`<button type="button" data-fa="delete">حذف</button>`);const isNewFb=fbPrevSeenAt>=0&&new Date(it.created_at).getTime()>fbPrevSeenAt;const card=document.createElement("div");card.className="admin-archive-row"+(it.status==="hidden"?" is-hidden":"");card.innerHTML=`<div class="fb-admin-who">${isNewFb?`<span class="admin-new-dot">🆕</span> `:""}👤 ${ndEscape(it.author_name)} · <span dir="ltr">${ndEscape(it.email||"")}</span> · <bdi>${ndEscape(it.member_no||"")}</bdi></div>
      <div style="white-space:pre-wrap;" dir="auto">${ndEscape(it.body)}</div>
      <div class="admin-archive-meta">${chips.join("")}</div>${dev}
      <div class="admin-archive-actions">${acts.join("")}</div>`;card.querySelectorAll("[data-fa]").forEach(b=>b.addEventListener("click",async()=>{const a=b.dataset.fa;if(a==="copy"){const t=[`${it.ref?"#"+it.ref+" · ":""}${it.author_name} · ${it.email||""} · ${it.member_no||""}`,it.body,""].concat(fbDeviceLines(it.device).map(([k,v])=>`${k}: ${v}`)).join("\n");try{await navigator.clipboard.writeText(t);showToast("📋 اتنسخت",1500);}catch(e){}return;}if(a==="delete"){if(!window.confirm(`حذف ${it.kind==="problem"?"البلاغ":"الرأي"} ده نهائيًا${it.kind==="suggestion"?" (هو وتأييداته)":""}؟ مفيش رجوع.`))return;const{error}=await supabaseClient.rpc("admin_delete_feedback",{p_id:it.id});if(error){showGlobalError("رسائل الأعضاء",adminErrText(error));return;}showToast("🗑️ اتحذف",1800);renderFeedbackAdmin();return;}if(a==="hide"&&!window.confirm("إخفاء الرأي ده عن الأعضاء؟"))return;const params={p_id:it.id,p_status:null,p_done:null};if(a==="publish"||a==="show")params.p_status="visible";if(a==="hide")params.p_status="hidden";if(a==="done")params.p_done=true;if(a==="undone")params.p_done=false;const{error}=await supabaseClient.rpc("admin_update_feedback",params);if(error){showGlobalError("رسائل الأعضاء",adminErrText(error));return;}showToast(a==="done"?"✅ تمت بفضل الله":a==="hide"?"🙈 اتخفت":a==="undone"?"↩️ اتلغت علامة تمت":"✅ بقت ظاهرة للأعضاء",1800);renderFeedbackAdmin();refreshAdminBadges(true);}));list.appendChild(card);});}function setupFeedbackAdmin(){const filter=document.getElementById("fbAdminFilter");if(filter)filter.addEventListener("change",fbRenderAdminList);const search=document.getElementById("fbAdminSearch");if(search)search.addEventListener("input",fbRenderAdminList);const pubCb=document.getElementById("fbPublishedNoteCb");if(pubCb)pubCb.addEventListener("change",async()=>{const{error}=await supabaseClient.from("app_settings").upsert({key:"feedback_show_published_note",value:pubCb.checked?"on":"off",updated_at:new Date().toISOString()});if(error){pubCb.checked=!pubCb.checked;showGlobalError("رسائل الأعضاء",adminErrText(error));return;}showToast(pubCb.checked?"✅ صاحب الرأي المنشور هيشوف «منشور لزملائك»":"✅ الجملة مش هتظهر على الآراء المنشورة",2500);});const noteCb=document.getElementById("fbHiddenNoteCb");if(noteCb)noteCb.addEventListener("change",async()=>{const{error}=await supabaseClient.from("app_settings").upsert({key:"feedback_show_hidden_note",value:noteCb.checked?"on":"off",updated_at:new Date().toISOString()});if(error){noteCb.checked=!noteCb.checked;showGlobalError("رسائل الأعضاء",adminErrText(error));return;}showToast(noteCb.checked?"✅ صاحب الرأي المخفي هيشوف إنه غير ظاهر":"✅ الرأي المخفي هيظهر لصاحبه عادي من غير جملة",2500);});const save=document.getElementById("fbModeSave");if(save)save.addEventListener("click",async()=>{const v=document.getElementById("fbModeSel").value;const{error}=await supabaseClient.from("app_settings").upsert({key:"feedback_moderation",value:v,updated_at:new Date().toISOString()});if(error){showGlobalError("رسائل الأعضاء",adminErrText(error));return;}showToast(v==="review"?"🛡️ الآراء الجديدة هتظهر بعد موافقتك":"⚡ الآراء الجديدة هتظهر علطول",2500);});}let contactEditorApi=null;function buildContactEditor(){const host=document.getElementById("contactEditor");if(!host)return;host.innerHTML="";const rowsBox=document.createElement("div");rowsBox.className="ce-rows";host.appendChild(rowsBox);let orig=JSON.stringify(ND.contactChannels||[]);const collect=()=>Array.from(rowsBox.querySelectorAll(".ce-row")).map(r=>({id:r.dataset.id,emoji:r.querySelector(".ce-emoji").value.trim()||"🔗",label:r.querySelector(".ce-label").value.trim(),url:r.querySelector(".ce-url").value.trim(),active:r.querySelector(".ce-active input").checked,places:Array.from(r.querySelectorAll(".ce-place input:checked")).map(x=>x.value),}));const addRow=(c)=>{const r=document.createElement("div");r.className="ce-row";r.dataset.id=c.id||("c"+Date.now().toString(36)+Math.random().toString(36).slice(2,5));r.innerHTML=`<div class="ce-top">
        <input class="admin-input ce-emoji" maxlength="4" aria-label="إيموجي">
        <input class="admin-input ce-label" placeholder="الاسم (مثل WhatsApp)">
        <label class="ce-active"><input type="checkbox"> مفعّلة</label>
        <button type="button" class="admin-url-remove ce-del" aria-label="حذف">✕</button>
      </div>
      <input class="admin-input ce-url" dir="ltr" placeholder="https://... أو mailto:...">
      <div class="ce-places">${CONTACT_PLACES.map(p=>`<label class="ce-place"><input type="checkbox" value="${p.key}"> ${p.label}</label>`).join("")}</div>`;r.querySelector(".ce-emoji").value=c.emoji||"🔗";r.querySelector(".ce-label").value=c.label||"";r.querySelector(".ce-url").value=c.url||"";r.querySelector(".ce-active input").checked=c.active!==false;r.querySelectorAll(".ce-place input").forEach(x=>{x.checked=(c.places||[]).indexOf(x.value)!==-1;});r.querySelector(".ce-del").addEventListener("click",()=>{if(!window.confirm(`حذف "${r.querySelector(".ce-label").value||"الوسيلة دي"}"؟ (هتتشال بعد ما تضغط «حفظ»)`))return;r.remove();bar.refresh();});r.addEventListener("input",()=>bar.refresh());r.addEventListener("change",()=>bar.refresh());rowsBox.appendChild(r);return r;};const bar=createAdminSaveBar(host,{isDirty:()=>JSON.stringify(collect())!==orig,onUndo:()=>{rowsBox.innerHTML="";JSON.parse(orig).forEach(addRow);},onSave:async()=>{const list=collect();const bad=list.find(c=>!c.label||!contactUrlOk(c.url));if(bad){showGlobalError("وسائل التواصل",`كل وسيلة لازم يبقى ليها اسم ورابط صحيح (يبدأ بـ https:// أو mailto:)${bad.label?" — "+bad.label:""}`);return false;}const{error}=await supabaseClient.from("app_settings").upsert({key:"contact_channels",value:JSON.stringify(list),updated_at:new Date().toISOString()});if(error){showGlobalError("وسائل التواصل",adminErrText(error));return false;}ND.contactChannels=list;try{localStorage.setItem(CONTACT_CACHE_KEY,JSON.stringify(list));}catch(e){}renderAllContactButtons();orig=JSON.stringify(collect());return true;},});(ND.contactChannels||[]).forEach(addRow);contactEditorApi={addRow:(c)=>{const r=addRow(c);bar.refresh();r.querySelector(".ce-label").focus();}};}let fbPrevSeenAt=-1;function fbMarkSeen(){fbPrevSeenAt=seenAt("fb");try{localStorage.setItem(seenKey("fb"),String(Date.now()));}catch(e){}adminSeenServer.fb=Date.now();saveAdminSeen("fb");adminBadgeCache.sug.nw=0;adminBadgeCache.prob.nw=0;applyAdminBadges();}let memPrevSeenAt=-1;function memMarkSeen(){memPrevSeenAt=seenAt("mem");try{localStorage.setItem(seenKey("mem"),String(Date.now()));}catch(e){}adminSeenServer.mem=Date.now();saveAdminSeen("mem");try{renderAdminMembersList();}catch(e){}adminBadgeCache.mem.nw=0;applyAdminBadges();}function setSectionBadge(perm,n){const header=document.querySelector(`#adminSectionsList .admin-item[data-perm="${perm}"] .app-guide-header`);if(!header)return;let b=header.querySelector(".admin-new-badge");if(!b){b=document.createElement("span");b.className="admin-new-badge";header.insertBefore(b,header.querySelector(".app-guide-chevron"));}b.textContent="+"+n;b.hidden=!n;}let adminNames={};function adminNameOf(id){return(id&&adminNames[id])||"أدمن";}async function loadAdminNames(){if(!supabaseClient||ND.isGuest)return;try{const{data,error}=await supabaseClient.rpc("get_admin_names");if(!error&&Array.isArray(data)){adminNames={};data.forEach(r=>{adminNames[r.id]=r.label;});}}catch(e){}}function fmtActTime(iso){if(!iso)return"";const d=new Date(iso);return`${d.getDate()}/${d.getMonth()+1} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;}function saveAdminSeen(kind){if(!supabaseClient||!ND.currentUserId)return;supabaseClient.from("admin_seen").upsert({user_id:ND.currentUserId,section:kind,seen_at:new Date().toISOString()}).then(()=>{},()=>{});}async function renderStaffNames(){const box=document.getElementById("staffNamesList");if(!box||!supabaseClient)return;if(!adminCan("admin_names")){box.innerHTML="";return;}box.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;const{data,error}=await supabaseClient.rpc("admin_list_staff");if(error){box.innerHTML=`<div class="auth-field-help">${ndEscape(adminErrText(error).replace("معرفتش أحفظ","معرفتش أحمّل الأدمنز"))}</div>`;return;}const permLabel=(k)=>{const x=(typeof ADMIN_SECTIONS!=="undefined"?ADMIN_SECTIONS:[]).find(p=>p.key===k);return x?x.label:k;};const fmtDay=(iso)=>{if(!iso)return"—";const d=new Date(iso);return`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;};box.innerHTML="";(data||[]).forEach(u=>{const row=document.createElement("div");row.className="staff-row";const roleTxt=u.role==="owner"?(u.is_primary_owner?"👑 المالك الأساسي":"👑 مالك"):"🛡️ أدمن";const perms=Array.isArray(u.admin_permissions)?u.admin_permissions:[];const permsHtml=u.role==="owner"?`<span class="staff-perm all">كل الصلاحيات</span>`:(perms.length?perms.map(k=>`<span class="staff-perm">${ndEscape(permLabel(k))}</span>`).join(""):`<span class="staff-perm none">مفيش صلاحيات</span>`);const last=u.last_action?`${ndEscape(u.last_action)}${u.last_action_detail?` <span class="staff-last-det" dir="auto">(${ndEscape(u.last_action_detail)})</span>`:""} · <bdi dir="ltr">${fmtActTime(u.last_action_at)}</bdi>`:"لسه ماعملش أي إجراء متسجّل";row.innerHTML=`<div class="staff-top"><span class="staff-role">${roleTxt}${u.id===ND.currentUserId?" · أنت":""}</span>
        <span class="staff-email" dir="ltr">${ndEscape(u.email||"")}</span></div>
      <div class="staff-member">اسمه كعضو: <b>${ndEscape(u.display_name||"—")}</b> · 🆔 <bdi dir="ltr">${ndEscape(u.member_no||"—")}</bdi> · 🗓️ اتسجّل ${fmtDay(u.created_at)}</div>
      <div class="staff-perms">🔑 ${permsHtml}</div>
      <div class="staff-last">⏱️ آخر إجراء: ${last}</div>
      <input type="text" class="admin-input staff-name" maxlength="40" placeholder="🏷️ اسمه جوه لوحة الأدمن (مثل: أ. أحمد)">
      <div class="staff-actions">
        <button type="button" class="staff-btn staff-page">📄 صفحته</button>
        <button type="button" class="staff-btn staff-log-btn">🗂️ سجل آخر أسبوعين (${u.actions_14d||0}) ▾</button>
      </div>
      <div class="staff-log" hidden></div>`;const inp=row.querySelector(".staff-name");inp.value=u.admin_name||"";let orig=inp.value;const bar=createAdminSaveBar(row.querySelector(".staff-actions").parentNode,{isDirty:()=>inp.value.trim()!==orig.trim(),onUndo:()=>{inp.value=orig;},onSave:async()=>{const{error:e2}=await supabaseClient.rpc("admin_set_admin_name",{p_user_id:u.id,p_name:inp.value.trim()});if(e2){showGlobalError("أسماء الأدمن",adminErrText(e2));return false;}orig=inp.value.trim();inp.value=orig;await loadAdminNames();return true;},});row.insertBefore(row.querySelector(".admin-saveundo"),row.querySelector(".staff-actions"));inp.addEventListener("input",bar.refresh);row.querySelector(".staff-page").addEventListener("click",async()=>{const item=document.querySelector('#adminSectionsList .admin-item[data-perm="members"]');if(!item){showToast("⚠️ محتاج صلاحية «الأعضاء» عشان تفتح صفحته",2500);return;}if(!item.classList.contains("open")){item.classList.add("open");try{memMarkSeen();}catch(e){}}if(typeof membersCache==="undefined"||!membersCache.some(m=>m.id===u.id)){try{await renderAdminMembersList();}catch(e){}}try{renderMemberDetail(u.id);showMembersLevel("detail");}catch(e){}setTimeout(()=>{try{item.scrollIntoView({behavior:"smooth",block:"start"});}catch(e){}},150);});const logBtn=row.querySelector(".staff-log-btn"),logBox=row.querySelector(".staff-log");logBtn.addEventListener("click",async()=>{logBox.hidden=!logBox.hidden;logBtn.textContent=`🗂️ سجل آخر أسبوعين (${u.actions_14d||0}) ${logBox.hidden?"▾":"▴"}`;if(logBox.hidden)return;logBox.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;const{data:acts,error:e3}=await supabaseClient.rpc("admin_staff_activity",{p_user_id:u.id,p_days:14});if(e3){logBox.innerHTML=`<div class="auth-field-help">${ndEscape(adminErrText(e3))}</div>`;return;}if(!acts||!acts.length){logBox.innerHTML=`<div class="auth-field-help">مفيش إجراءات في آخر أسبوعين</div>`;return;}let lastDay="";logBox.innerHTML=acts.map(x=>{const d=new Date(x.created_at);const day=`${d.getDate()}/${d.getMonth()+1}`;const head=day!==lastDay?`<div class="staff-log-day">📅 ${day}</div>`:"";lastDay=day;return`${head}<div class="staff-log-row"><span class="staff-log-time" dir="ltr">${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}</span>
          <span class="staff-log-act">${ndEscape(x.action)}</span>${x.detail?`<span class="staff-log-det" dir="auto">${ndEscape(x.detail)}</span>`:""}</div>`;}).join("");});box.appendChild(row);});}function roleLabel(r,isPrimary){if(r==="owner")return isPrimary?"👑 مالك أساسي":"👑 مالك ثانوي";return{admin:"🛡️ أدمن",member:"عضو"}[r]||r;}const ADMIN_SECTIONS=[{key:"motivation",label:"الرسالة التحفيزية وجمل الترحيب"},{key:"welcome",label:"رسالة الترحيب"},{key:"fields",label:"حقول التسجيل"},{key:"countries",label:"قوائم الدول"},{key:"notifications",label:"الإشعارات — إرسال رسائل"},{key:"notif_manage",label:"الإشعارات — إدارة الأرشيف (إخفاء/إلغاء/حذف)"},{key:"reminder_texts",label:"الإشعارات — رسائل التذكيرات الأساسية"},{key:"comingsoon",label:"قريبًا"},{key:"points",label:"إعدادات نظام النقاط"},{key:"members",label:"الأعضاء"},{key:"member_wipe",label:"🧹 مسح بيانات الأعضاء من أجهزتهم وحذفهم"},{key:"version",label:"إصدار التطبيق (فرض تحديث)"},{key:"feedback",label:"رسائل الأعضاء (Feedback)"},{key:"admin_names",label:"🏷️ أسماء الأدمن"},{key:"testing_tools",label:"Testing Tools"}];function ndCanWipe(){return ND.currentUserRole==="owner"||(Array.isArray(ND.currentUserPermissions)&&ND.currentUserPermissions.includes("member_wipe"));}function ndWipeButtonsHtml(m){const ownerOk=m.role!=="owner"||(!m.is_primary_owner&&ND.currentUserIsPrimaryOwner);if(!ndCanWipe()||!ownerOk)return"";return`
    <div class="admin-wipe-box">
      <div class="admin-member-actions">
        <button class="admin-add-btn admin-wipe1-btn">🧹 امسح بنك الأسئلة من موبايله</button>
        <button class="admin-add-btn admin-wipe2-btn">⛔ حظر</button>
        <button class="admin-add-btn admin-delete-btn">🗑️ حذف العضو</button>
      </div>
      <div class="admin-wipe-orders" aria-live="polite"></div>
    </div>`;}const ND_WIPE_REASON={admin:"من اللوحة",expired:"انتهاء العضوية",revoked:"إلغاء التفعيل",banned:"حظر",deleted:"حذف العضو"};const ND_WIPE_LEVEL={1:"بنك الأسئلة",2:"كل حاجة + خروج",3:"حذف الحساب"};function ndWipeWhen(t){try{return t?new Date(t).toLocaleString("ar-EG",{day:"numeric",month:"numeric",hour:"2-digit",minute:"2-digit"}):"";}catch(e){return"";}}function ndWipeOrdersHtml(rows,withName){if(!rows||!rows.length)return`<div class="admin-wipe-empty">مفيش أوامر مسح.</div>`;return rows.map(r=>{const st=r.done_at?(r.done_note==="not_needed"?`↩️ اتلغى لوحده (اتفعّل تاني أو جدّد) ${ndEscape(ndWipeWhen(r.done_at))}`:`✅ تم التنفيذ ${ndEscape(ndWipeWhen(r.done_at))}`):`⏳ مازال منتظر التنفيذ`;const seen=r.device_last_seen?` · آخر ظهور ${ndEscape(ndWipeWhen(r.device_last_seen))}`:"";return`<div class="admin-wipe-row">
      ${withName?`<div class="admin-wipe-name">${ndEscape(r.member_label||"—")}</div>`:""}
      <div>${ndEscape(ND_WIPE_LEVEL[r.level]||"")} · ${ndEscape(ND_WIPE_REASON[r.reason]||"")} · ${ndEscape(ndWipeWhen(r.created_at))}${r.created_by_name?" · "+ndEscape(r.created_by_name):""}</div>
      <div>📱 ${ndEscape(r.device_label||"جهاز")}${seen}</div>
      <div class="admin-wipe-status">${st}</div>
    </div>`;}).join("");}async function ndWipeLoadOrders(box,uid){if(!box)return;try{const{data,error}=await supabaseClient.rpc("admin_wipe_orders",{p_user_id:uid,p_limit:50});if(error){console.warn("[admin] wipe orders",error.code||error.message);box.textContent="معرفتش أجيب أوامر المسح.";return;}box.innerHTML=ndWipeOrdersHtml(data,false);return data;}catch(e){console.warn("[admin] wipe orders",e&&e.message);box.textContent="معرفتش أجيب أوامر المسح.";}}function ndWireWipeButtons(content,m,refresh){const box=content.querySelector(".admin-wipe-orders");if(!box)return;ndWipeLoadOrders(box,m.id).then(rows=>{if(Object.prototype.hasOwnProperty.call(m,"banned_at")||!ndBannedFromOrders(m,rows))return;if(!content.isConnected)return;m._ndBanFromOrders=true;ndApplyBannedUi(content,m);});let busy=false;const run=async(level)=>{if(busy)return;const txt=level===1?`مسح بنك الأسئلة من موبايل ${m.email}؟ لو العضو لسه مفعّل، البنك هيتنزّل تاني أول مزامنة.`:`حظر ${m.email}؟ تفعيله هيتلغي، وكل حاجة تخص التطبيق هتتمسح من موبايله ويخرج. بياناته على السيرفر بتفضل زي ما هي.`;if(!confirm(txt))return;busy=true;try{const{data,error}=level===1?await supabaseClient.rpc("admin_wipe_member",{p_user_id:m.id}):await supabaseClient.rpc("admin_ban_member",{p_user_id:m.id});if(error){console.warn("[admin] wipe",error.code||error.message);showAuthError("adminMembersWarning","معرفتش أعمل الأمر — لازم صلاحية مسح بيانات الأعضاء");return;}if(level===2)ndPeersPending={uid:m.id,res:await ndPeersFetch(m.id)};if(level===2&&typeof refresh==="function"){await refresh();refreshAdminBadges(true);}showAuthError("adminMembersWarning",data>0?`اتعمل أمر لـ ${data} جهاز، وهيتنفذ أول ما الموبايل يفتح بالنت.`:"مفيش أجهزة متسجلة للعضو ده (مافتحش التطبيق بالنت من إصدار 9.3).");if(level===1)ndWipeLoadOrders(box,m.id);}catch(e){console.warn("[admin] wipe",e&&e.message);showAuthError("adminMembersWarning","معرفتش أعمل الأمر — اتأكد من النت وجرّب تاني");}finally{busy=false;}};const b1=content.querySelector(".admin-wipe1-btn");if(b1)b1.addEventListener("click",()=>run(1));const b2=content.querySelector(".admin-wipe2-btn");if(b2)b2.addEventListener("click",()=>run(2));}function ndMemberExpired(m){if(!m||!m.admin_approved||!m.membership_expires_at)return false;const t=new Date(m.membership_expires_at).getTime();return Number.isFinite(t)&&t<Date.now();}function ndMemberBanned(m){if(!m||m.admin_approved)return false;if(Object.prototype.hasOwnProperty.call(m,"banned_at"))return!!m.banned_at;return m._ndBanFromOrders===true;}function ndBannedFromOrders(m,rows){if(!m||m.admin_approved||!Array.isArray(rows))return false;const since=m.approval_changed_at?new Date(m.approval_changed_at).getTime()-2000:0;return rows.some(r=>r&&r.reason==="banned"&&new Date(r.created_at).getTime()>=since);}function ndApplyBannedUi(content,m){const email=content.querySelector(".member-detail-email");if(email&&!email.querySelector(".nd-ban"))email.insertAdjacentHTML("beforeend",` <span class="sub-badge nd-ban">⛔ محظور</span>`);const btn=content.querySelector(".admin-approve-btn");if(btn&&!m.admin_approved)btn.textContent="✅ فك الحظر...";}function ndPeerStatus(p){if(!p.admin_approved&&p.banned_at)return"⛔ محظور";if(p.admin_approved)return ndMemberExpired(p)?"⌛ منتهية":"✅ مفعّل";return p.approved_at?"🚫 ملغي تفعيله":"⏳ مستني التفعيل";}async function ndPeersFetch(uid){try{const{data,error}=await supabaseClient.rpc("admin_device_peers",{p_user_id:uid});if(error){console.warn("[admin] device peers",error.code||error.message);return{ok:false,rows:[]};}return{ok:true,rows:Array.isArray(data)?data:[]};}catch(e){console.warn("[admin] device peers",e&&e.message);return{ok:false,rows:[]};}}function ndPeersHtml(res){let body;if(!res||!res.ok)body=`<div class="admin-wipe-empty">معرفتش أجيب الحسابات اللي على نفس الأجهزة.</div>`;else if(!res.rows.length)body=`<div class="admin-wipe-empty">مفيش حسابات تانية اتفتحت على أجهزته.</div>`;else body=res.rows.map(p=>`<div class="admin-wipe-row">
      <div class="admin-wipe-name">${ndEscape(p.email||"—")} <bdi class="member-no-tag">${ndEscape(p.member_no||"")}</bdi></div>
      <div>${ndEscape(ndPeerStatus(p))}${p.display_name?" · "+ndEscape(p.display_name):""}</div>
      <div>📱 ${ndEscape(p.device_label||"جهاز")}${p.last_seen?" · آخر مرة "+ndEscape(ndWipeWhen(p.last_seen)):""}</div>
      <button type="button" class="admin-add-btn nd-peer-open" data-uid="${ndEscape(p.user_id)}">👤 افتح الكارت</button>
    </div>`).join("")+`<div class="admin-peers-note">لو حد فيهم محتاج يتحظر أو يتحذف، افتح كارته. القرار ليك.</div>`;return`<div class="admin-peers-box" aria-live="polite">
      <div class="admin-peers-title">📱 حسابات اتفتحت على نفس أجهزة العضو ده</div>
      ${body}
    </div>`;}async function ndOpenMemberCard(uid){if(!membersCache.find(x=>x.id===uid)){try{const{data:fresh,error}=await supabaseClient.rpc("admin_list_members");if(error)console.warn("[admin] members reload",error.code||error.message);if(fresh){membersCache=fresh;renderMembersCategoryCards();}}catch(e){console.warn("[admin] members reload",e&&e.message);}}renderMemberDetail(uid);showMembersLevel("detail");}function ndWirePeerButtons(root){if(!root)return;root.querySelectorAll(".nd-peer-open").forEach(b=>b.addEventListener("click",()=>ndOpenMemberCard(b.dataset.uid)));}let ndPeersPending=null;async function ndWipeLoadAll(){const wrap=document.getElementById("adminWipeAllWrap");const box=document.getElementById("adminWipeAllList");if(!wrap||!box)return;wrap.style.display=ndCanWipe()?"":"none";if(!ndCanWipe())return;box.textContent="بيتحمّل...";try{const{data,error}=await supabaseClient.rpc("admin_wipe_orders",{p_user_id:null,p_limit:100});if(error){console.warn("[admin] wipe orders all",error.code||error.message);box.textContent="معرفتش أجيب أوامر المسح.";return;}box.innerHTML=ndWipeOrdersHtml(data,true);}catch(e){console.warn("[admin] wipe orders all",e&&e.message);box.textContent="معرفتش أجيب أوامر المسح.";}}let membersCache=[];let currentMembersCategory=null;async function renderAdminMembersList(){const ownerRow=document.getElementById("adminOwnerAddRow");if(!supabaseClient)return;if(ownerRow)ownerRow.style.display=ND.currentUserRole==="owner"?"block":"none";showMembersLevel("categories");ndPeersPending=null;const grid=document.getElementById("membersCategoryGrid");if(grid)grid.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;const{data:members,error}=await supabaseClient.rpc("admin_list_members");if(error||!members){const raw=error?(error.message||JSON.stringify(error)):"لا توجد بيانات";if(grid)grid.innerHTML=`<div class="auth-field-help">معرفتش أجيب الأعضاء — (${ndEscape(raw)})</div>`;return;}membersCache=members;renderMembersCategoryCards();}function renderMembersCategoryCards(){const grid=document.getElementById("membersCategoryGrid");if(!grid)return;grid.innerHTML=`
    <button type="button" class="member-category-card cat-pending" data-cat="pending">
      <span class="mcc-icon">⏳</span><span class="mcc-label">منتظرة تفعيل</span><span class="mcc-count" id="catCountPending">0</span>
    </button>
    <button type="button" class="member-category-card cat-active" data-cat="active">
      <span class="mcc-icon">✅</span><span class="mcc-label">مفعّلة</span><span class="mcc-count" id="catCountActive">0</span>
    </button>
    <button type="button" class="member-category-card cat-revoked" data-cat="revoked">
      <span class="mcc-icon">🚫</span><span class="mcc-label">تم إلغاء تفعيلها</span><span class="mcc-count" id="catCountRevoked">0</span>
    </button>
    <button type="button" class="member-category-card cat-admins" data-cat="admins" id="catCardAdmins" style="display:none;">
      <span class="mcc-icon">🛡️</span><span class="mcc-label">الأدمنز</span><span class="mcc-count" id="catCountAdmins">0</span>
    </button>
  `;const counts={pending:0,active:0,revoked:0,admins:0};membersCache.forEach(m=>{if(m.role==="owner")return;counts[categorizeMember(m)]++;if(m.role==="admin")counts.admins++;});const set=(id,n)=>{const el=document.getElementById(id);if(el)el.textContent=n;};set("catCountPending",counts.pending);set("catCountActive",counts.active);set("catCountRevoked",counts.revoked);set("catCountAdmins",counts.admins);const adminsCard=document.getElementById("catCardAdmins");if(adminsCard)adminsCard.style.display=ND.currentUserRole==="owner"?"flex":"none";grid.querySelectorAll(".member-category-card").forEach(card=>{card.addEventListener("click",()=>{currentMembersCategory=card.dataset.cat;const listSearch=document.getElementById("membersListSearch");if(listSearch)listSearch.value="";renderMembersEmailListForCategory(currentMembersCategory,"");showMembersLevel("list");});});}function showMembersLevel(level){const cat=document.getElementById("membersLevelCategories");const list=document.getElementById("membersLevelList");const detail=document.getElementById("membersLevelDetail");if(cat)cat.style.display=level==="categories"?"block":"none";if(list)list.style.display=level==="list"?"block":"none";if(detail)detail.style.display=level==="detail"?"block":"none";}function renderMembersEmailListForCategory(category,query){const wrap=document.getElementById("membersEmailList");if(!wrap)return;const q=(query||"").trim().toLowerCase();const items=membersCache.filter(m=>{if(m.role==="owner")return false;if(category==="admins"){if(m.role!=="admin")return false;}else if(category&&categorizeMember(m)!==category){return false;}if(q&&!m.email.toLowerCase().includes(q)&&!(m.member_no||"").toLowerCase().includes(q))return false;return true;});renderMembersEmailRows(items,wrap);}function renderMembersGlobalSearchResults(query){const wrap=document.getElementById("membersEmailList");if(!wrap)return;const q=(query||"").trim().toLowerCase();const items=membersCache.filter(m=>m.role!=="owner"&&(m.email.toLowerCase().includes(q)||(m.member_no||"").toLowerCase().includes(q)));currentMembersCategory=null;renderMembersEmailRows(items,wrap);showMembersLevel("list");}function renderMembersEmailRows(items,wrap){if(!items.length){wrap.innerHTML=`<div class="auth-field-help">مفيش نتايج</div>`;return;}const catBadge={pending:"⏳",active:"✅",revoked:"🚫"};wrap.innerHTML="";items.forEach(m=>{const row=document.createElement("div");row.className="member-email-row";row.innerHTML=`
      <span>${catBadge[categorizeMember(m)]||""} ${ndEscape(m.email)} <bdi class="member-no-tag">${ndEscape(m.member_no||"")}</bdi></span>
      ${categorizeMember(m)==="active"?(ndMemberExpired(m)?`<span class="mer-badge mer-wait">⌛ منتهية</span>`:`<span class="mer-badge sub-badge">Subscribed</span>`):""}
      ${(memPrevSeenAt>=0&&new Date(m.created_at).getTime()>memPrevSeenAt)?`<span class="mer-badge mer-new">🆕</span>`:""}
      ${categorizeMember(m)==="pending"?`<span class="mer-badge mer-wait">⏳ مستني التفعيل</span>`:""}
      ${m.role==="admin"?`<span class="mer-badge role-admin">🛡️ ${ndEscape(adminNames[m.id]||"أدمن")}</span>`:""}
      <span style="flex-shrink:0;">→</span>
    `;row.style.cursor="pointer";row.addEventListener("click",()=>{renderMemberDetail(m.id);showMembersLevel("detail");});wrap.appendChild(row);});}async function renderMemberDetail(memberId){const content=document.getElementById("membersDetailContent");if(!content)return;const m=membersCache.find(x=>x.id===memberId);if(!m){content.innerHTML=`<div class="auth-field-help">معرفتش ألاقي العضو ده</div>`;return;}const ndExpired=ndMemberExpired(m),ndBanned=ndMemberBanned(m);content.innerHTML=`<div class="auth-field-help">بيتحمّل تفاصيل الاستمارة...</div>`;const{data:answers,error:answersErr}=await supabaseClient.rpc("admin_get_member_answers",{p_user_id:m.id});const trialDays=Math.floor((Date.now()-new Date(m.trial_started_at).getTime())/(1000*60*60*24));const myPerms=Array.isArray(m.admin_permissions)?m.admin_permissions:[];const expiresLabel=m.membership_expires_at?`— لغاية ${new Date(m.membership_expires_at).toLocaleDateString("en-GB")}`:(m.admin_approved?"— بلا تاريخ انتهاء":"");const answersHtml=(answers&&answers.length)?answers.map(a=>{let val=a.value;if(Array.isArray(val))val=val.join("، ");else if(val&&typeof val==="object"&&val.code)val=`${val.code} ${val.number||""}`;return`<div class="member-answer-row"><span class="mar-label">${ndEscape(a.label)}</span><span class="mar-value">${ndEscape(val==null?"":val)}</span></div>`;}).join(""):(answersErr?`<div class="auth-field-help" style="color:#ff9a9a;">${ndEscape(adminErrText(answersErr).replace("معرفتش أحفظ","معرفتش أحمّل بيانات الاستمارة"))}</div>`:`<div class="auth-field-help">مفيش بيانات استمارة محفوظة</div>`);content.innerHTML=`
    <div class="member-detail-card">
      <div class="member-detail-email">${ndEscape(m.email)}${categorizeMember(m)==="active"?(ndExpired?` <span class="sub-badge nd-exp">⌛ منتهية</span>`:` <span class="sub-badge">✅ Subscribed</span>`):""}${ndBanned?` <span class="sub-badge nd-ban">⛔ محظور</span>`:""}</div>
      <div class="member-detail-ids">
        <span class="member-id-chip">🆔 <bdi>${ndEscape(m.member_no||"—")}</bdi></span>
        <span class="member-id-chip">🗓️ اتسجّل: <bdi dir="ltr">${m.created_at?new Date(m.created_at).toLocaleString("en-GB",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):"—"}</bdi></span>
      </div>
      <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-bottom:10px;">
        ${ndEscape(m.display_name||"بدون اسم")} · ${roleLabel(m.role,m.is_primary_owner)} · يوم ${trialDays} من التجربة ${expiresLabel}
      </div>
      ${m.approval_changed_by?`<div class="act-by">${m.admin_approved?"✅ فعّله":"⛔ ألغى تفعيله"}: <b>${ndEscape(adminNameOf(m.approval_changed_by))}</b> · <bdi dir="ltr">${fmtActTime(m.approval_changed_at)}</bdi></div>`:""}
      <div class="admin-member-actions">
        <button class="admin-add-btn admin-approve-btn ${m.admin_approved&&!ndExpired?"is-active":""}">${ndBanned?"✅ فك الحظر...":ndExpired?"✅ تجديد...":m.admin_approved?"❌ إلغاء التفعيل":"✅ موافقة..."}</button>
        <button class="admin-add-btn admin-name-reset-btn" ${m.name_change_count===0?"disabled":""}>🔓 اسمح بتغيير الاسم</button>
        ${ND.currentUserRole==="owner"&&m.role==="member"?`<button class="admin-add-btn admin-role-toggle-btn">⬆️ ترقية لأدمن</button>`:""}
        ${ND.currentUserRole==="owner"&&m.role==="admin"?`<button class="admin-add-btn admin-role-toggle-btn">⬇️ تراجع لعضو</button>`:""}
        ${ND.currentUserIsPrimaryOwner&&m.role==="owner"&&!m.is_primary_owner?`<button class="admin-add-btn admin-demote-owner-btn">⬇️ تنزيل من مالك لأدمن</button>`:""}
      </div>
      ${ndWipeButtonsHtml(m)}
      ${ndPeersPending&&ndPeersPending.uid===m.id?ndPeersHtml(ndPeersPending.res):""}
      <div class="admin-approve-panel" style="display:none;">
        <div class="admin-approve-shortcuts">
          <button type="button" class="admin-add-btn app-1d">+ يوم</button>
          <button type="button" class="admin-add-btn app-1m">+ شهر</button>
          <button type="button" class="admin-add-btn app-1y">+ سنة</button>
          <button type="button" class="admin-add-btn app-none">بلا تاريخ انتهاء</button>
        </div>
        <input type="date" class="admin-input app-date-input" style="width:100%;box-sizing:border-box;margin:8px 0;">
        <button class="admin-save-btn app-confirm-btn">✅ تأكيد الموافقة</button>
      </div>
      ${ND.currentUserRole==="owner"&&m.role==="admin"?`
      <div class="admin-permissions-box">
        <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:6px;">صلاحيات هذا الأدمن في لوحة الأدمن:</div>
        <label class="admin-checkbox-row admin-perm-all-row" style="margin-bottom:8px;">
          <input type="checkbox" id="permAllCheckbox">
          🌟 جميع الصلاحيات (يتحول لمالك ثانوي — كل مميزات المالك، ما عدا حذف/تنزيل المالك الأساسي)
        </label>
        ${ADMIN_SECTIONS.map(s=>`
          <label class="admin-checkbox-row" style="margin-bottom:4px;">
            <input type="checkbox" class="admin-perm-checkbox" data-section="${s.key}" ${myPerms.includes(s.key)?"checked":""}>
            ${s.label}
          </label>
        `).join("")}
      </div>`:""}
      <div class="member-answers-box">
        <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:6px;">📝 بيانات استمارة التسجيل:</div>
        ${answersHtml}
      </div>
    </div>
  `;const refresh=async()=>{const{data:fresh}=await supabaseClient.rpc("admin_list_members");if(fresh){membersCache=fresh;renderMembersCategoryCards();}renderMemberDetail(memberId);};ndWirePeerButtons(content.querySelector(".admin-peers-box"));content.querySelector(".admin-approve-btn").addEventListener("click",async()=>{if(m.admin_approved&&!ndMemberExpired(m)){const{error}=await supabaseClient.rpc("admin_set_member_approved",{p_user_id:m.id,p_approved:false});if(error)showAuthError("adminMembersWarning",adminErrText(error));else{showAuthError("adminMembersWarning","");await refresh();refreshAdminBadges(true);}return;}const panel=content.querySelector(".admin-approve-panel");panel.style.display=panel.style.display==="none"?"block":"none";});const dateInput=content.querySelector(".app-date-input");const setDateOffset=(unit)=>{const d=new Date();if(unit==="d")d.setDate(d.getDate()+1);else if(unit==="m")d.setMonth(d.getMonth()+1);else if(unit==="y")d.setFullYear(d.getFullYear()+1);dateInput.value=d.toISOString().slice(0,10);};content.querySelector(".app-1d").addEventListener("click",()=>setDateOffset("d"));content.querySelector(".app-1m").addEventListener("click",()=>setDateOffset("m"));content.querySelector(".app-1y").addEventListener("click",()=>setDateOffset("y"));content.querySelector(".app-none").addEventListener("click",()=>{dateInput.value="";});content.querySelector(".app-confirm-btn").addEventListener("click",async()=>{const expiresAt=dateInput.value?new Date(dateInput.value+"T23:59:59").toISOString():null;const{error}=await supabaseClient.rpc("admin_set_member_approved",{p_user_id:m.id,p_approved:true,p_expires_at:expiresAt});if(error&&/lifting a ban/i.test(String(error.message||"")))showAuthError("adminMembersWarning","معرفتش أفك الحظر — لازم صلاحية مسح بيانات الأعضاء");else if(error)showAuthError("adminMembersWarning",adminErrText(error));else{showAuthError("adminMembersWarning","");await refresh();}});content.querySelector(".admin-name-reset-btn").addEventListener("click",async()=>{const{error}=await supabaseClient.rpc("admin_reset_name_change",{p_user_id:m.id});if(error)showAuthError("adminMembersWarning",adminErrText(error));else{showAuthError("adminMembersWarning","");await refresh();}});ndWireWipeButtons(content,m,refresh);const deleteBtn=content.querySelector(".admin-delete-btn");if(deleteBtn){deleteBtn.addEventListener("click",async()=>{if(!confirm(`حذف ${m.email} نهائيًا؟ ده هيمسح حسابه بالكامل ومش هينفع يرجع.`))return;const peers=await ndPeersFetch(m.id);const{error}=await supabaseClient.rpc("admin_delete_member",{p_user_id:m.id});if(error){showAuthError("adminMembersWarning","معرفتش أحذف — لازم صلاحية مسح بيانات الأعضاء وحذفهم");return;}showAuthError("adminMembersWarning","");ndPeersPending=null;const{data:fresh}=await supabaseClient.rpc("admin_list_members");if(fresh){membersCache=fresh;renderMembersCategoryCards();}showMembersLevel("list");if(currentMembersCategory)renderMembersEmailListForCategory(currentMembersCategory,"");const listWrap=document.getElementById("membersEmailList");if(listWrap){listWrap.insertAdjacentHTML("afterbegin",ndPeersHtml(peers));ndWirePeerButtons(listWrap.querySelector(".admin-peers-box"));}});}const roleBtn=content.querySelector(".admin-role-toggle-btn");if(roleBtn){roleBtn.addEventListener("click",async()=>{const newRole=m.role==="admin"?"member":"admin";const{error}=await supabaseClient.rpc("owner_set_role_by_email",{p_email:m.email,p_role:newRole});if(error)showAuthError("adminMembersWarning","معرفتش أعدّل — لازم تكون المالك");else{showAuthError("adminMembersWarning","");await refresh();refreshAdminBadges(true);}});}const demoteOwnerBtn=content.querySelector(".admin-demote-owner-btn");if(demoteOwnerBtn){demoteOwnerBtn.addEventListener("click",async()=>{if(!confirm(`تنزيل ${m.email} من مالك ثانوي لأدمن عادي؟`))return;const{error}=await supabaseClient.rpc("owner_demote_secondary_owner",{p_user_id:m.id});if(error)showAuthError("adminMembersWarning","معرفتش أنزّل — لازم تكون المالك الأساسي");else{showAuthError("adminMembersWarning","");await refresh();refreshAdminBadges(true);}});}const permAllCheckbox=content.querySelector("#permAllCheckbox");if(permAllCheckbox){permAllCheckbox.addEventListener("change",async()=>{if(!permAllCheckbox.checked){permAllCheckbox.checked=true;return;}if(!confirm(`تأكيد؟ ${m.email} هيتحول لمالك ثانوي، وهياخد كل مميزات المالك ما عدا حذف/تنزيل المالك الأساسي.`)){permAllCheckbox.checked=false;return;}const{error}=await supabaseClient.rpc("owner_promote_to_secondary_owner",{p_user_id:m.id});if(error){showAuthError("adminMembersWarning","معرفتش أرقّي — لازم تكون المالك");permAllCheckbox.checked=false;}else{showAuthError("adminMembersWarning","");await refresh();}});}content.querySelectorAll(".admin-perm-checkbox").forEach(cb=>{cb.addEventListener("change",async()=>{const checked=Array.from(content.querySelectorAll(".admin-perm-checkbox")).filter(x=>x.checked).map(x=>x.dataset.section);const{error}=await supabaseClient.rpc("owner_set_admin_permissions",{p_user_id:m.id,p_permissions:checked});if(error){showAuthError("adminMembersWarning",adminErrText(error));cb.checked=!cb.checked;}else{showAuthError("adminMembersWarning","");showToast("✅ اتحفظت الصلاحيات",1600);}});});}async function renderAdminSignupIntro(){const el=document.getElementById("adminSignupIntroText");if(!el||!supabaseClient)return;el.value=await loadSignupIntroText();}async function handleSaveSignupIntro(){const el=document.getElementById("adminSignupIntroText");const btn=document.getElementById("adminSignupIntroSave");if(!el)return;showAuthError("adminSignupIntroWarning","");const{error}=await saveSignupIntroText(el.value.trim());if(error){showAuthError("adminSignupIntroWarning","معرفتش أحفظ — لازم تكون مسجّل دخول بحساب عليه صلاحية أدمن");}else if(btn){btn.classList.add("saved-flash");setTimeout(()=>btn.classList.remove("saved-flash"),600);}}function fieldTypeLabel(t){return{text:"نص حر",number:"رقم",select:"اختيار من قائمة",multi_select:"اختيار متعدد من قائمة",country:"دولة",phone_country_code:"رقم تواصل بكود دولة"}[t]||t;}async function renderAdminFieldsList(){const list=document.getElementById("adminFieldsList");if(!list||!supabaseClient)return;list.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;const{data:fields,error}=await supabaseClient.from("field_definitions").select("*").order("display_order");if(error||!fields){list.innerHTML=`<div class="auth-field-help">معرفتش أجيب الحقول</div>`;return;}list.innerHTML="";fields.forEach(f=>{const row=document.createElement("div");row.className="admin-field-row";row.innerHTML=`
      <div class="admin-field-row-top">
        <input type="text" class="admin-input admin-field-label-input" value="${ndEscape(f.label||"")}">
        <button class="admin-url-remove admin-field-delete" aria-label="حذف">✕</button>
      </div>
      <div class="admin-field-row-mid">
        <span class="admin-field-type-tag">${ndEscape(fieldTypeLabel(f.field_type))}</span>
        <label class="admin-checkbox-row"><input type="checkbox" class="admin-field-required" ${f.is_required?"checked":""}> إجباري</label>
      </div>
      <textarea class="admin-textarea admin-field-help-input" rows="1" placeholder="شرح/مثال يظهر تحت الحقل">${ndEscape(f.help_text||"")}</textarea>
      ${(f.field_type==="select"||f.field_type==="multi_select")?`<label class="admin-label">الاختيارات</label><div class="admin-field-options-editor"></div>`:""}
    `;const labelInput=row.querySelector(".admin-field-label-input");const reqCheckbox=row.querySelector(".admin-field-required");const helpInput=row.querySelector(".admin-field-help-input");const delBtn=row.querySelector(".admin-field-delete");const isSelect=(f.field_type==="select"||f.field_type==="multi_select");const optsBox=row.querySelector(".admin-field-options-editor");let optsEd=null;let orig=null;const curOpts=()=>optsEd?JSON.stringify(optsEd.getOptions()):"[]";const snapshot=()=>({label:labelInput.value,help:helpInput.value,req:reqCheckbox.checked,opts:curOpts()});const bar=createAdminSaveBar(row,{isDirty:()=>!!orig&&(labelInput.value!==orig.label||helpInput.value!==orig.help||reqCheckbox.checked!==orig.req||curOpts()!==orig.opts),onUndo:()=>{labelInput.value=orig.label;helpInput.value=orig.help;reqCheckbox.checked=orig.req;if(optsBox)optsEd=buildOptionsEditor(optsBox,JSON.parse(orig.opts),()=>bar.refresh());},onSave:async()=>{const label=labelInput.value.trim();if(!label){showAuthError("adminFieldsWarning","نص السؤال مايبقاش فاضي");return false;}const upd={label,is_required:reqCheckbox.checked,help_text:helpInput.value.trim()||null,updated_at:new Date().toISOString()};if(isSelect&&optsEd){const o=optsEd.getOptions();if(o.length<2){showAuthError("adminFieldsWarning","لازم اختيارين على الأقل");return false;}upd.options=o;}const{error}=await supabaseClient.from("field_definitions").update(upd).eq("id",f.id);if(error){showAuthError("adminFieldsWarning",adminErrText(error));return false;}showAuthError("adminFieldsWarning","");try{localStorage.removeItem("nd_signup_schema_v1");}catch(e){}orig=snapshot();return true;},});if(optsBox){optsEd=buildOptionsEditor(optsBox,f.options||[],()=>bar.refresh());optsBox.addEventListener("input",bar.refresh);}orig=snapshot();labelInput.addEventListener("input",bar.refresh);helpInput.addEventListener("input",bar.refresh);reqCheckbox.addEventListener("change",bar.refresh);delBtn.addEventListener("click",async()=>{if(!window.confirm(`حذف السؤال "${f.label}" من استمارة التسجيل؟ مش هيظهر تاني للأعضاء الجداد.`))return;const{error}=await supabaseClient.from("field_definitions").delete().eq("id",f.id);if(error)showAuthError("adminFieldsWarning",adminErrText(error));else{showAuthError("adminFieldsWarning","");showToast("✅ اتحذف السؤال",2000);renderAdminFieldsList();}});list.appendChild(row);});}function buildOptionsEditor(container,initial,onChange){container.innerHTML="";container.classList.add("opt-editor");const rows=document.createElement("div");rows.className="opt-editor-rows";const addBtn=document.createElement("button");addBtn.type="button";addBtn.className="opt-editor-add";addBtn.textContent="➕ إضافة خيار";container.appendChild(rows);container.appendChild(addBtn);function getOptions(){return Array.from(rows.querySelectorAll("input")).map(i=>i.value.trim()).filter(Boolean);}function addRow(value,focus){const row=document.createElement("div");row.className="opt-editor-row";row.innerHTML=`<span class="opt-editor-num"></span>
      <input type="text" class="admin-input" dir="auto" placeholder="اكتب الخيار هنا">
      <button type="button" class="admin-url-remove" aria-label="حذف الخيار">✕</button>`;const input=row.querySelector("input");input.value=value||"";input.addEventListener("change",()=>onChange&&onChange(getOptions()));input.addEventListener("keydown",(e)=>{if(e.key==="Enter"){e.preventDefault();addRow("",true);}});row.querySelector("button").addEventListener("click",()=>{if(rows.children.length<=1){input.value="";}else{row.remove();}renumber();onChange&&onChange(getOptions());});rows.appendChild(row);renumber();if(focus)input.focus();}function renumber(){Array.from(rows.children).forEach((r,i)=>{r.querySelector(".opt-editor-num").textContent=(i+1)+".";});}addBtn.addEventListener("click",()=>addRow("",true));const start=(initial&&initial.length)?initial:["",""];start.forEach(v=>addRow(v,false));return{getOptions};}let newFieldOptionsEditor=null;function updateNewFieldExtra(){const typeEl=document.getElementById("newFieldType");const extra=document.getElementById("newFieldExtra");if(!typeEl||!extra)return;const type=typeEl.value;if(type==="select"||type==="multi_select"){extra.innerHTML=`<label class="admin-label">الاختيارات (كل خيار في خانة)</label><div id="newFieldOptionsEditor"></div>`;newFieldOptionsEditor=buildOptionsEditor(document.getElementById("newFieldOptionsEditor"),[],null);}else if(type==="country"||type==="phone_country_code"){extra.innerHTML=`<select class="admin-textarea" id="newFieldListKey">
      <option value="residence">قائمة دولة الإقامة</option>
      <option value="nationality">قائمة الجنسية</option>
      <option value="contact_code">قائمة كود رقم التواصل</option>
    </select>`;}else{extra.innerHTML="";}}async function handleAddField(){const label=(document.getElementById("newFieldLabel").value||"").trim();const type=document.getElementById("newFieldType").value;const help=(document.getElementById("newFieldHelp").value||"").trim();const required=document.getElementById("newFieldRequired").checked;showAuthError("adminFieldsWarning","");if(!label){showAuthError("adminFieldsWarning","اكتب عنوان الحقل الأول");return;}let options=null,listKey=null;if(type==="select"||type==="multi_select"){options=newFieldOptionsEditor?newFieldOptionsEditor.getOptions():[];if(options.length<2){showAuthError("adminFieldsWarning","اكتب اختيارين على الأقل — كل خيار في خانة");return;}}else if(type==="country"||type==="phone_country_code"){const lkEl=document.getElementById("newFieldListKey");listKey=lkEl?lkEl.value:"residence";}const{data:last}=await supabaseClient.from("field_definitions").select("display_order").order("display_order",{ascending:false}).limit(1);const nextOrder=(last&&last[0]?last[0].display_order:0)+1;const{error}=await supabaseClient.from("field_definitions").insert({field_key:"custom_"+Date.now(),label,field_type:type,is_required:required,help_text:help||null,options,list_key:listKey,display_order:nextOrder});if(error){showAuthError("adminFieldsWarning","معرفتش أضيف — لازم تكون مسجّل دخول بحساب عليه صلاحية أدمن");}else{document.getElementById("newFieldLabel").value="";document.getElementById("newFieldHelp").value="";document.getElementById("newFieldRequired").checked=false;updateNewFieldExtra();renderAdminFieldsList();}}async function renderAdminCountriesList(){const picker=document.getElementById("countryListPicker");const search=document.getElementById("countrySearchInput");const list=document.getElementById("adminCountriesList");if(!picker||!list||!supabaseClient)return;list.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;const listKey=picker.value;const{data,error}=await supabaseClient.from("country_list_memberships").select("id, is_active, countries(id, name_ar, name_en, dial_code, flag_emoji)").eq("list_key",listKey).order("display_order");if(error){list.innerHTML=`<div class="auth-field-help">معرفتش أجيب الدول (${ndEscape(error.message||"خطأ")}) — لازم تكون مسجّل دخول</div>`;return;}const allData=data||[];const query=((search&&search.value)||"").trim().toLowerCase();const filtered=query?allData.filter(m=>(m.countries.name_ar||"").includes(query)||(m.countries.name_en||"").toLowerCase().includes(query)):allData;if(filtered.length===0){list.innerHTML=`<div class="auth-field-help">مفيش نتايج${query?" للبحث ده":""}</div>`;return;}list.innerHTML="";filtered.forEach(m=>{const row=document.createElement("div");row.className="admin-country-row";row.innerHTML=`
      <label style="display:flex;align-items:center;gap:8px;flex:1;">
        <input type="checkbox" ${m.is_active?"checked":""}>
        <span>${ndEscape(m.countries.flag_emoji||"")} ${ndEscape(m.countries.name_ar||m.countries.name_en)}</span>
        ${listKey==="contact_code"?`<span class="admin-country-code">${ndEscape(m.countries.dial_code||"")}</span>`:""}
      </label>
      <button class="admin-url-remove admin-country-delete" aria-label="حذف الدولة نهائيًا">✕</button>
    `;row.querySelector("input[type=checkbox]").addEventListener("change",async(e)=>{const{error}=await supabaseClient.from("country_list_memberships").update({is_active:e.target.checked}).eq("id",m.id);if(error){showAuthError("adminCountriesWarning","معرفتش أحفظ — لازم صلاحية أدمن");e.target.checked=!e.target.checked;}else{showAuthError("adminCountriesWarning","");showToast(e.target.checked?"✅ اتفعّلت في القائمة":"⏸️ اتشالت من القائمة",1600);m.is_active=e.target.checked;}});row.querySelector(".admin-country-delete").addEventListener("click",async()=>{if(!window.confirm(`حذف "${m.countries.name_ar||m.countries.name_en}" نهائيًا من كل القوائم؟ مفيش رجوع.`))return;const{error}=await supabaseClient.from("countries").delete().eq("id",m.countries.id);if(error){showAuthError("adminCountriesWarning","معرفتش أحذف — لازم صلاحية أدمن");}else{showAuthError("adminCountriesWarning","");renderAdminCountriesList();}});list.appendChild(row);});}async function handleAddCountry(){const nameAr=(document.getElementById("newCountryNameAr").value||"").trim();const nameEn=(document.getElementById("newCountryNameEn").value||"").trim();const dialCode=(document.getElementById("newCountryDialCode").value||"").trim();const flag=(document.getElementById("newCountryFlag").value||"").trim();showAuthError("adminCountriesWarning","");if(!nameEn){showAuthError("adminCountriesWarning","اكتب اسم الدولة بالإنجليزي على الأقل");return;}const{data:newCountry,error}=await supabaseClient.from("countries").insert({name_en:nameEn,name_ar:nameAr||nameEn,dial_code:dialCode||null,flag_emoji:flag||null}).select().single();if(error||!newCountry){showAuthError("adminCountriesWarning","معرفتش أضيف — لازم تكون مسجّل دخول بحساب عليه صلاحية أدمن");return;}await supabaseClient.from("country_list_memberships").insert([{list_key:"nationality",country_id:newCountry.id,display_order:999},{list_key:"residence",country_id:newCountry.id,display_order:999},{list_key:"contact_code",country_id:newCountry.id,display_order:999}]);document.getElementById("newCountryNameAr").value="";document.getElementById("newCountryNameEn").value="";document.getElementById("newCountryDialCode").value="";document.getElementById("newCountryFlag").value="";adminCountriesCache={listKey:null,data:[]};renderAdminCountriesList();}function setupAdminForms(){document.querySelectorAll("#adminSectionsList .app-guide-item:not(.admin-locked) .app-guide-header").forEach(header=>{header.addEventListener("click",()=>{header.closest(".app-guide-item").classList.toggle("open");});});const introSaveBtn=document.getElementById("adminSignupIntroSave");if(introSaveBtn)introSaveBtn.addEventListener("click",handleSaveSignupIntro);const newFieldType=document.getElementById("newFieldType");if(newFieldType){newFieldType.addEventListener("change",updateNewFieldExtra);updateNewFieldExtra();}const addFieldBtn=document.getElementById("addFieldBtn");if(addFieldBtn)addFieldBtn.addEventListener("click",handleAddField);const countryPicker=document.getElementById("countryListPicker");if(countryPicker)countryPicker.addEventListener("change",()=>renderAdminCountriesList());const countrySearch=document.getElementById("countrySearchInput");if(countrySearch)countrySearch.addEventListener("input",()=>renderAdminCountriesList());const addCountryBtn=document.getElementById("addCountryBtn");if(addCountryBtn)addCountryBtn.addEventListener("click",handleAddCountry);const membersBackToCategories=document.getElementById("membersBackToCategories");if(membersBackToCategories){membersBackToCategories.addEventListener("click",()=>{const gs=document.getElementById("membersGlobalSearch");if(gs)gs.value="";showMembersLevel("categories");});}const membersBackToList=document.getElementById("membersBackToList");if(membersBackToList){membersBackToList.addEventListener("click",()=>{if(currentMembersCategory){renderMembersEmailListForCategory(currentMembersCategory,document.getElementById("membersListSearch").value);showMembersLevel("list");}else{showMembersLevel("categories");}});}const membersGlobalSearch=document.getElementById("membersGlobalSearch");if(membersGlobalSearch){membersGlobalSearch.addEventListener("input",()=>{const q=membersGlobalSearch.value.trim();if(q)renderMembersGlobalSearchResults(q);else showMembersLevel("categories");});}const membersListSearch=document.getElementById("membersListSearch");if(membersListSearch){membersListSearch.addEventListener("input",()=>{renderMembersEmailListForCategory(currentMembersCategory,membersListSearch.value);});}const addAdminBtn=document.getElementById("addAdminBtn");if(addAdminBtn){addAdminBtn.addEventListener("click",async()=>{const emailEl=document.getElementById("newAdminEmail");const email=(emailEl.value||"").trim();showAuthError("adminMembersWarning","");if(!email){showAuthError("adminMembersWarning","اكتب إيميل العضو الأول");return;}const{error}=await supabaseClient.rpc("owner_set_role_by_email",{p_email:email,p_role:"admin"});if(error){showAuthError("adminMembersWarning",`معرفتش أرقّي — (${error.message||JSON.stringify(error)})`);}else{emailEl.value="";renderAdminMembersList();}});}const ttResetAll=document.getElementById("ttResetAll");if(ttResetAll){ttResetAll.addEventListener("click",async()=>{if(!confirm("هيمسح كل بيانات جهازك المحلية (نقاطك، تقدمك، إعداداتك) بلا رجعة. متأكد؟"))return;await resetAll();location.reload();});}const ttSimulateNewUser=document.getElementById("ttSimulateNewUser");if(ttSimulateNewUser){ttSimulateNewUser.addEventListener("click",async()=>{if(!confirm("هيمسح بيانات جهازك ويسجّلك خروج، عشان تجرب التطبيق كمستخدم جديد تمامًا. متأكد؟"))return;await resetAll();if(supabaseClient){try{await supabaseClient.auth.signOut();}catch(e){}}location.reload();});}const shiftLocalDates=async(days)=>{const ms=days*24*60*60*1000;ND.debugTimeOffsetMs+=ms;await saveDebugTimeOffset(ND.debugTimeOffsetMs);if(!ND.isGuest&&ND.currentUserId&&supabaseClient){ND.currentUserTrialStart-=ms;await supabaseClient.from("users").update({trial_started_at:new Date(ND.currentUserTrialStart).toISOString()}).eq("id",ND.currentUserId);}location.reload();};const ttForwardDay=document.getElementById("ttForwardDay");if(ttForwardDay)ttForwardDay.addEventListener("click",()=>shiftLocalDates(1));const ttForwardWeek=document.getElementById("ttForwardWeek");if(ttForwardWeek)ttForwardWeek.addEventListener("click",()=>shiftLocalDates(7));const ttResetTime=document.getElementById("ttResetTime");if(ttResetTime)ttResetTime.addEventListener("click",resetTimeTravel);const recomputeCycleSave=document.getElementById("recomputeCycleSave");if(recomputeCycleSave){recomputeCycleSave.addEventListener("click",async()=>{const val=parseInt(document.getElementById("recomputeCycleInput").value,10);if(!Number.isFinite(val)||val<1){showAuthError("adminMembersWarning","اكتب رقم أيام صحيح");return;}const{error}=await saveRecomputeCycleDays(val);if(error){showAuthError("adminMembersWarning","معرفتش أحفظ — لازم تكون المالك");}else{ND.recomputeCycleDays=val;showAuthError("adminMembersWarning","");recomputeCycleSave.classList.add("saved-flash");setTimeout(()=>recomputeCycleSave.classList.remove("saved-flash"),600);}});}const publishVersionBtn=document.getElementById("publishVersionBtn");if(publishVersionBtn){publishVersionBtn.addEventListener("click",async()=>{const{error}=await supabaseClient.from("app_settings").upsert({key:"required_app_version",value:APP_VERSION_LABEL,updated_at:new Date().toISOString()});if(error){showAuthError("adminMembersWarning","معرفتش أنشر — لازم تكون المالك");}else{showAuthError("adminMembersWarning","");publishVersionBtn.classList.add("saved-flash");publishVersionBtn.disabled=true;const versionNote=document.getElementById("versionStatusNote");if(versionNote)versionNote.textContent=`✅ الملف ده (إصدار ${APP_VERSION_LABEL}) هو المنشور حاليًا على الكل.`;setTimeout(()=>publishVersionBtn.classList.remove("saved-flash"),600);}});}setupMotivAdmin();setupFeedbackAdmin();const welcomeSaveBtn=document.getElementById("adminWelcomeSave");if(welcomeSaveBtn){welcomeSaveBtn.addEventListener("click",async()=>{const val=document.getElementById("adminWelcomeText").value.trim();if(val)ND.welcomeMessageText=val;await saveWelcomeMessage(ND.welcomeMessageText);welcomeSaveBtn.classList.add("saved-flash");setTimeout(()=>welcomeSaveBtn.classList.remove("saved-flash"),600);});}const notifSendBtn=document.getElementById("adminNotifSend");const notifArchiveToggle=document.getElementById("adminNotifArchiveToggle");const notifArchiveList=document.getElementById("adminNotifArchiveList");const TARGET_LABEL={now:"📨 إرسال فوري",r1:"⏰ مع التذكير الأول",r2:"⏰ مع التذكير الثاني",r3:"⏰ مع التذكير الثالث"};const AUDIENCE_LABEL={members:"👤 الأعضاء",all:"🌍 الكل"};const MONTHS_AR=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];const notifFilterEl=document.getElementById("adminNotifFilter");const ND_MEDIA_BUCKET="notif-media";const REMINDER_DEFAULT_TEXT="قال صلى الله عليه وسلم: احرص على ما ينفعك واستعن بالله ولا تعجز.";async function renderAdminNotifArchive(){if(!notifArchiveList)return;notifArchiveList.innerHTML=`<div style="opacity:.7;font-size:13px;">بيتحمّل...</div>`;const{data,error}=await supabaseClient.from("notifications").select("*").order("created_at",{ascending:false}).limit(300);if(error){notifArchiveList.innerHTML=`<div style="opacity:.7;font-size:13px;">معرفتش أحمّل الأرشيف</div>`;return;}const all=data||[];const totalBytes=all.reduce((sum,n)=>sum+(Array.isArray(n.images)?n.images.reduce((x,im)=>x+(Number(im&&im.size)||0),0):0),0);const filter=notifFilterEl?notifFilterEl.value:"all";const rows=all.filter(n=>{const t=n.target||"now";if(filter==="now")return t==="now";if(filter==="linked")return t!=="now";if(filter==="hidden")return!!n.hidden_at;if(filter==="cancelled")return!!n.cancelled_at;if(filter==="scheduled")return!!(n.scheduled_at&&!n.dispatched_at&&!n.cancelled_at);return true;});const today=ndTodayISO();const canManage=(ND.currentUserRole==="owner")||(Array.isArray(ND.currentUserPermissions)&&ND.currentUserPermissions.includes("notif_manage"));const canSend=(ND.currentUserRole==="owner")||(Array.isArray(ND.currentUserPermissions)&&ND.currentUserPermissions.includes("notifications"));const fmtWhen=(iso)=>{const d=new Date(iso);return`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} — ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;};let html=`<div class="admin-storage-line">🖼️ مساحة صور الرسائل: ${(totalBytes/1048576).toFixed(1)}MB من 1024MB المجانية</div>`;if(rows.length===0)html+=`<div style="opacity:.7;font-size:13px;">${all.length?"مفيش رسائل بالفلتر ده":"لسه مفيش رسائل مرسلة"}</div>`;let lastMonth="";rows.forEach(n=>{const d=new Date(n.created_at);const monthKey=`${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`;if(monthKey!==lastMonth){html+=`<div class="admin-archive-month">📅 ${monthKey}</div>`;lastMonth=monthKey;}const time=`${d.getDate()}/${d.getMonth()+1} — ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;const t=n.target||"now";let deliveryChips;if(t!=="now"){deliveryChips=n.cancelled_at?"":`<span class="admin-archive-chip chip-reminder">⏰ بتتبعت مع التذكير في ميعاده</span>`;if(!n.cancelled_at){const expired=n.valid_until&&String(n.valid_until)<today;const fd=(v)=>{const p=String(v).split("-");return p.length===3?`${+p[2]}/${+p[1]}/${p[0]}`:v;};const range=(!n.valid_from&&!n.valid_until)?"من غير تاريخ بداية أو نهاية":(n.valid_from&&n.valid_until)?`من ${fd(n.valid_from)} لحد ${fd(n.valid_until)}`:n.valid_from?`من ${fd(n.valid_from)} (من غير تاريخ نهاية)`:`لحد ${fd(n.valid_until)}`;deliveryChips+=`<span class="admin-archive-chip chip-validity">📅 ${range}${expired?" (انتهت)":""}</span>`;}}else if(n.scheduled_at&&!n.dispatched_at){deliveryChips=n.cancelled_at?`<span class="admin-archive-chip chip-cancelled">⛔ اتلغت قبل ميعادها (${fmtWhen(n.scheduled_at)})</span>`:`<span class="admin-archive-chip chip-reminder">⏳ مجدولة: ${fmtWhen(n.scheduled_at)}</span>`;}else if(typeof n.sent_count==="number"){deliveryChips=`<span class="admin-archive-chip chip-sent">📤 اتبعتت لـ ${n.sent_count} جهاز</span>
          <span class="admin-archive-chip chip-delivered">✅ وصلت فعليًا لـ ${n.delivered_count||0}</span>`;}else{deliveryChips=`<span class="admin-archive-chip chip-muted">— قبل نظام التتبع</span>`;}const media=ndMediaBadges(n);const status=(n.hidden_at?`<span class="admin-archive-chip chip-hidden">🙈 مخفية عن الأعضاء</span>`:"")+(n.cancelled_at?`<span class="admin-archive-chip chip-cancelled">⛔ ملغية</span>`:"");html+=`
        <div class="admin-archive-row ${n.hidden_at?"is-hidden":""}">
          <div>${ndEscape(n.text)}</div>
          <div class="admin-archive-meta">
            <span class="admin-archive-chip chip-time">🕒 ${time}</span>
            <span class="admin-archive-chip ${t==="now"?"chip-now":"chip-reminder"}">${TARGET_LABEL[t]||t}</span>
            <span class="admin-archive-chip chip-audience">${AUDIENCE_LABEL[n.audience]||AUDIENCE_LABEL.members}</span>
            ${media?`<span class="admin-archive-chip">${media}</span>`:""}
            ${deliveryChips}
            ${status}
            ${n.created_by?`<span class="admin-archive-chip act-chip">📤 أرسلها: ${ndEscape(adminNameOf(n.created_by))}</span>`:""}
          </div>
          ${(n.scheduled_at&&!n.dispatched_at&&!n.cancelled_at&&(canSend||canManage))?`<div class="admin-archive-actions">
            <button type="button" data-sact="edit" data-nid="${ndEscape(n.id)}">🕒 تغيير الموعد</button>
            <button type="button" data-sact="now" data-nid="${ndEscape(n.id)}">🚀 إرسال الآن</button>
            <button type="button" data-sact="cancel" data-nid="${ndEscape(n.id)}">⛔ إلغاء الجدولة</button>
          </div>
          <div class="admin-row2" data-sedit="${ndEscape(n.id)}" style="display:none; margin-top:6px;">
            <div><input type="date" class="admin-textarea" data-sdate></div>
            <div><input type="time" class="admin-textarea" data-stime></div>
            <div style="flex:0 0 auto;"><button type="button" class="admin-save-btn" data-ssave="${ndEscape(n.id)}" style="margin:0;padding:10px 12px;">💾</button></div>
          </div>`:""}
          ${canManage?`<div class="admin-archive-actions">
            ${n.hidden_at?`<button type="button" data-nact="unhide" data-nid="${ndEscape(n.id)}">👁️ إظهار تاني</button>`:`<button type="button" data-nact="hide" data-nid="${ndEscape(n.id)}">🙈 إخفاء</button>`}
            ${t!=="now"&&!n.cancelled_at?`<button type="button" data-nact="cancel" data-nid="${ndEscape(n.id)}">⛔ إلغاء</button>`:""}
            <button type="button" data-nact="delete" data-nid="${ndEscape(n.id)}">✅ تمت بفضل الله</button>
          </div>`:""}
        </div>`;});notifArchiveList.innerHTML=html;const byId={};all.forEach(n=>{byId[n.id]=n;});notifArchiveList.querySelectorAll("[data-sact]").forEach(btn=>{btn.addEventListener("click",async()=>{const n=byId[btn.dataset.nid];if(!n)return;const act=btn.dataset.sact;try{if(act==="edit"){const box=notifArchiveList.querySelector(`[data-sedit="${CSS.escape(n.id)}"]`);if(!box)return;const d=new Date(n.scheduled_at);box.querySelector("[data-sdate]").value=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;box.querySelector("[data-stime]").value=`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;box.style.display=box.style.display==="none"?"flex":"none";return;}if(act==="now"){const{error}=await supabaseClient.from("notifications").update({scheduled_at:new Date().toISOString()}).eq("id",n.id);if(error)throw error;showToast("🚀 هتتبعت خلال دقيقة بإذن الله",3500);}else if(act==="cancel"){if(!window.confirm("إلغاء جدولة الرسالة دي؟ مش هتتبعت ومش هتظهر لأي حد."))return;const{error}=await supabaseClient.from("notifications").update({cancelled_at:new Date().toISOString()}).eq("id",n.id);if(error)throw error;showToast("⛔ اتلغت الجدولة",3000);}renderAdminNotifArchive();}catch(e){showGlobalError("الرسائل المجدولة",e);}});});notifArchiveList.querySelectorAll("[data-ssave]").forEach(btn=>{btn.addEventListener("click",async()=>{const n=byId[btn.dataset.ssave];const box=btn.closest("[data-sedit]");if(!n||!box)return;const dv=box.querySelector("[data-sdate]").value,tv=box.querySelector("[data-stime]").value;const when=new Date(`${dv}T${tv}`);if(!dv||!tv||isNaN(when.getTime())){showGlobalError("تغيير الموعد","اختار اليوم والساعة");return;}if(when.getTime()<Date.now()+60*1000){showGlobalError("تغيير الموعد","الموعد لازم يكون بعد دقيقة على الأقل من دلوقتي");return;}try{const{error}=await supabaseClient.from("notifications").update({scheduled_at:when.toISOString()}).eq("id",n.id);if(error)throw error;showToast("🕒 اتغيّر الموعد",2500);renderAdminNotifArchive();}catch(e){showGlobalError("تغيير الموعد",e);}});});notifArchiveList.querySelectorAll("[data-nact]").forEach(btn=>{btn.addEventListener("click",async()=>{const n=byId[btn.dataset.nid];if(!n)return;const act=btn.dataset.nact;const PUSH_NOTE="\n\nملحوظة: الإشعار اللي وصل خلاص على شاشات الموبايلات مابيتسحبش.";try{if(act==="hide"){if(!window.confirm("الرسالة هتختفي من صندوق كل الأعضاء، وتفضل هنا في الأرشيف وتقدر ترجّعها."+PUSH_NOTE))return;const{error}=await supabaseClient.from("notifications").update({hidden_at:new Date().toISOString()}).eq("id",n.id);if(error)throw error;showToast("🙈 الرسالة اتخفت من صناديق الأعضاء",3000);}else if(act==="unhide"){const{error}=await supabaseClient.from("notifications").update({hidden_at:null}).eq("id",n.id);if(error)throw error;showToast("👁️ الرسالة رجعت تظهر للأعضاء",3000);}else if(act==="cancel"){if(!window.confirm("إلغاء الرسالة دي هيوقف إرسالها مع التذكير من دلوقتي، والتذكير هيرجع لرسالته الأساسية. اللي وصلتهم قبل كده هتفضل في صندوقهم (ولو عايز تشيلها منه استخدم إخفاء)."))return;const{error}=await supabaseClient.from("notifications").update({cancelled_at:new Date().toISOString()}).eq("id",n.id);if(error)throw error;showToast("⛔ اتلغت — التذكير رجع لرسالته الأساسية",3500);}else if(act==="delete"){if(!window.confirm("✅ تمت بفضل الله: الرسالة هتتشال من صندوق الكل ومن الأرشيف، وصورها كمان. مفيش رجوع."+PUSH_NOTE))return;const paths=(Array.isArray(n.images)?n.images:[]).map(im=>im&&im.path).filter(Boolean);if(paths.length){const{error:rmErr}=await supabaseClient.storage.from(ND_MEDIA_BUCKET).remove(paths);if(rmErr)throw new Error(`مسح الصور: ${rmErr.message}`);}const{error}=await supabaseClient.from("notifications").delete().eq("id",n.id);if(error)throw error;showToast("✅ تمت بفضل الله، واتشالت الرسالة",3000);}renderAdminNotifArchive();}catch(e){showGlobalError("إدارة الإشعارات",e);}});});}if(notifFilterEl)notifFilterEl.addEventListener("change",()=>renderAdminNotifArchive());if(notifArchiveToggle&&notifArchiveList){notifArchiveToggle.addEventListener("click",()=>{const open=notifArchiveList.style.display==="none";notifArchiveList.style.display=open?"flex":"none";if(notifFilterEl)notifFilterEl.style.display=open?"block":"none";notifArchiveToggle.textContent=open?"📦 أرشيف الرسائل المرسلة ▴":"📦 أرشيف الرسائل المرسلة ▾";if(open)renderAdminNotifArchive();});}const notifTargetSel=document.getElementById("adminNotifTarget");const validityWrap=document.getElementById("adminNotifValidityWrap");const vFromEl=document.getElementById("adminNotifValidFrom");const vUntilEl=document.getElementById("adminNotifValidUntil");const whenWrap=document.getElementById("adminNotifWhenWrap");const whenSel=document.getElementById("adminNotifWhen");const schedRow=document.getElementById("adminNotifScheduleRow");const schedNote=document.getElementById("adminNotifScheduleNote");const schedDateEl=document.getElementById("adminNotifSchedDate");const schedTimeEl=document.getElementById("adminNotifSchedTime");const ymd=(d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;function syncWhenUI(){const isNow=!notifTargetSel||notifTargetSel.value==="now";if(whenWrap)whenWrap.style.display=isNow?"block":"none";const later=isNow&&whenSel&&whenSel.value==="later";if(schedRow)schedRow.style.display=later?"flex":"none";if(schedNote)schedNote.style.display=later?"block":"none";if(later&&schedDateEl&&!schedDateEl.value){const t=new Date();t.setDate(t.getDate()+1);schedDateEl.value=ymd(t);if(schedTimeEl&&!schedTimeEl.value)schedTimeEl.value="20:00";}if(schedDateEl)schedDateEl.min=ymd(new Date());if(notifSendBtn)notifSendBtn.textContent=later?"⏳ جدولة الرسالة":"📨 إرسال";}if(whenSel)whenSel.addEventListener("change",syncWhenUI);function syncValidityUI(){syncWhenUI();if(!notifTargetSel||!validityWrap)return;const linked=notifTargetSel.value!=="now";validityWrap.style.display=linked?"block":"none";if(linked&&vFromEl&&!vFromEl.value){vFromEl.value=ndTodayISO();if(vUntilEl&&!vUntilEl.value){const d=new Date();d.setDate(d.getDate()+6);vUntilEl.value=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}}}if(notifTargetSel)notifTargetSel.addEventListener("change",syncValidityUI);syncValidityUI();const imgInput=document.getElementById("adminNotifImages");const imgPreview=document.getElementById("adminNotifImagesPreview");if(imgInput&&imgPreview){imgInput.addEventListener("change",()=>{imgPreview.innerHTML="";const files=Array.from(imgInput.files||[]);if(files.length>4)showToast("⚠️ هيتاخد أول 4 صور بس",3000);files.slice(0,4).forEach(f=>{const im=document.createElement("img");im.src=URL.createObjectURL(f);im.onload=()=>URL.revokeObjectURL(im.src);imgPreview.appendChild(im);});});}const imgLinksEl=document.getElementById("adminNotifImageLinks");const imgLinksPreview=document.getElementById("adminNotifImageLinksPreview");const readImageLinks=()=>String(imgLinksEl?imgLinksEl.value:"").split("\n").map(x=>x.trim()).filter(Boolean);if(imgLinksEl&&imgLinksPreview){imgLinksEl.addEventListener("change",()=>{imgLinksPreview.innerHTML="";readImageLinks().slice(0,6).forEach(raw=>{const im=ndImageFromLink(raw);const warn=(msg)=>{const w=document.createElement("span");w.className="ag-note";w.textContent=msg;return w;};if(!im){imgLinksPreview.appendChild(warn(`⚠️ مش رابط صحيح: ${raw}`));return;}const img=document.createElement("img");img.src=im.url;img.title=raw;img.onerror=()=>img.replaceWith(warn(`⚠️ صورة مش بتحمّل — اتأكد إنها متشاركة "أي حد معاه الرابط"`));imgLinksPreview.appendChild(img);});});}async function ndCompressImage(file,maxDim,quality){const url=URL.createObjectURL(file);try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error(`مش قادر أقرا الصورة: ${file.name}`));i.src=url;});const scale=Math.min(1,(maxDim||1280)/Math.max(img.naturalWidth,img.naturalHeight));const w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));const c=document.createElement("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);const blob=await new Promise(res=>c.toBlob(res,"image/jpeg",quality||0.8));if(!blob)throw new Error("فشل تصغير الصورة");return{blob,w,h};}finally{URL.revokeObjectURL(url);}}function ndUuid(){if(window.crypto&&crypto.randomUUID)return crypto.randomUUID();const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;const h=Array.from(b,x=>x.toString(16).padStart(2,"0")).join("");return`${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;}function parseAdminLinks(raw){return String(raw||"").split("\n").map(line=>line.trim()).filter(Boolean).map(line=>{const parts=line.split("|");const url=parts.pop().trim();const title=parts.join("|").trim();return{title:title||null,url};});}const notifMedia=createMediaEditor(document.getElementById("adminNotifMediaEditor"),{bucket:ND_MEDIA_BUCKET});if(notifSendBtn){notifSendBtn.addEventListener("click",async()=>{const textEl=document.getElementById("adminNotifText");const targetEl=document.getElementById("adminNotifTarget");const audienceEl=document.getElementById("adminNotifAudience");const bodyEl=document.getElementById("adminNotifBody");const text=(textEl.value||"").trim();if(!text)return;const target=targetEl.value;const audience=audienceEl?audienceEl.value:"members";const body=bodyEl?(bodyEl.value||"").trim():"";const mv=notifMedia?notifMedia.validate():{ok:true};if(!mv.ok){showGlobalError("إرسال الإشعار",mv.error);return;}let validFrom=null,validUntil=null;if(target!=="now"){validFrom=(vFromEl&&vFromEl.value)||null;validUntil=(vUntilEl&&vUntilEl.value)||null;if(validFrom&&validUntil&&validUntil<validFrom){showGlobalError("إرسال الإشعار","تاريخ النهاية قبل تاريخ البداية");return;}}let scheduledAt=null;if(target==="now"&&whenSel&&whenSel.value==="later"){const dv=schedDateEl?schedDateEl.value:"";const tv=schedTimeEl?schedTimeEl.value:"";if(!dv||!tv){showGlobalError("جدولة الإشعار","اختار اليوم والساعة");return;}const when=new Date(`${dv}T${tv}`);if(isNaN(when.getTime())){showGlobalError("جدولة الإشعار","الموعد مش صحيح");return;}if(when.getTime()<Date.now()+60*1000){showGlobalError("جدولة الإشعار","الموعد لازم يكون بعد دقيقة على الأقل من دلوقتي");return;}scheduledAt=when.toISOString();}notifSendBtn.disabled=true;const oldLabel=notifSendBtn.textContent;notifSendBtn.textContent="⏳ بيتبعت...";showAuthError("adminMembersWarning","");const id=ndNewId();let built=null;try{built=notifMedia?await notifMedia.buildImages(id,(i,n)=>{notifSendBtn.textContent=`⏳ بيرفع الصور (${i}/${n})...`;}):{images:[],uploaded:[]};notifSendBtn.textContent="⏳ بيتبعت...";const{error}=await supabaseClient.from("notifications").insert({id,text,target,audience,body:body||null,links:notifMedia?notifMedia.getLinks():[],images:built.images,video_url:notifMedia?notifMedia.getVideo():null,valid_from:validFrom,valid_until:validUntil,scheduled_at:scheduledAt,});if(error)throw new Error(`حفظ الرسالة: ${error.message}`);textEl.value="";if(bodyEl)bodyEl.value="";if(notifMedia)notifMedia.reset();if(target==="now"&&scheduledAt){const d=new Date(scheduledAt);showToast(`⏳ اتجدولت — هتتبعت يوم ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} الساعة ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")} بإذن الله`,6000);}else if(target==="now"){const r=await sendRealPushNotification("OOC New Day",text,{audience,notificationId:id});showToast(`📤 اتبعتت لـ ${r.sent||0} جهاز — إيصالات الاستلام الفعلية هتظهر في الأرشيف خلال ثواني${r.removed?` (واتشال ${r.removed} اشتراك منتهي)`:""}`,6000);if(notifArchiveList&&notifArchiveList.style.display!=="none")setTimeout(renderAdminNotifArchive,6000);}else{showToast(`⏰ اتحفظت — هتتبعت مع ${TARGET_LABEL[target].replace("⏰ مع ","")} لكل عضو في ميعاده`,5000);}if(notifArchiveList&&notifArchiveList.style.display!=="none")renderAdminNotifArchive();}catch(e){const up=(e&&e.uploaded)||(built&&built.uploaded)||[];if(up.length&&notifMedia)await notifMedia.removeUploaded(up);showGlobalError("إرسال الإشعار",e);}finally{notifSendBtn.disabled=false;notifSendBtn.textContent=oldLabel;}});}const baseSaveBtn=document.getElementById("adminReminderBaseSave");const BASE_KEYS=["r1","r2","r3"];const REMINDER_BASE_FAIL="⚠️ معرفتش أجيب الرسائل — اقفل اللوحة وافتحها تاني";let reminderBaseState="idle";async function loadReminderBaseTexts(){BASE_KEYS.forEach(k=>{const el=document.getElementById("adminReminderBase_"+k);if(el)el.placeholder=REMINDER_DEFAULT_TEXT;});if(reminderBaseState==="loading"||reminderBaseState==="ok")return;reminderBaseState="loading";if(baseSaveBtn)baseSaveBtn.disabled=true;showAuthError("adminReminderBaseWarning","");let ok=false;try{if(supabaseClient){const{data,error}=await withTimeout(supabaseClient.from("app_settings").select("key, value").in("key",BASE_KEYS.map(k=>"reminder_text_"+k)),10000,"رسائل التذكيرات");if(!error){(data||[]).forEach(row=>{const el=document.getElementById("adminReminderBase_"+row.key.replace("reminder_text_",""));if(el)el.value=row.value||"";});ok=true;}}}catch(e){}reminderBaseState=ok?"ok":"failed";if(baseSaveBtn)baseSaveBtn.disabled=!ok;showAuthError("adminReminderBaseWarning",ok?"":REMINDER_BASE_FAIL);}retryReminderBaseTexts=()=>{if(reminderBaseState==="failed")loadReminderBaseTexts();};loadReminderBaseTexts();if(baseSaveBtn){baseSaveBtn.addEventListener("click",async()=>{baseSaveBtn.disabled=true;try{for(const k of BASE_KEYS){const el=document.getElementById("adminReminderBase_"+k);const v=el?(el.value||"").trim():"";const key="reminder_text_"+k;const{error}=v?await supabaseClient.from("app_settings").upsert({key,value:v,updated_at:new Date().toISOString()}):await supabaseClient.from("app_settings").delete().eq("key",key);if(error)throw error;}showToast("✅ اتحفظت الرسائل الأساسية للتذكيرات",3000);}catch(e){showGlobalError("حفظ رسائل التذكيرات",e);}finally{baseSaveBtn.disabled=false;}});}const csAddBtn=document.getElementById("adminComingSoonAdd");if(csAddBtn){csAddBtn.addEventListener("click",async()=>{const input=document.getElementById("adminComingSoonInput");const text=(input.value||"").trim();if(!text)return;ND.comingSoonItems.push({id:"cs_"+Date.now(),text});await saveComingSoonItems(ND.comingSoonItems);input.value="";renderAdminComingSoonList();renderComingSoonSheetList();});}renderAdminComingSoonList();const lockBtn=document.getElementById("adminLockBtn");if(lockBtn){lockBtn.addEventListener("click",()=>{ND.adminUnlocked=false;saveAdminUnlocked(false);navigate("chapters");});}}function renderAdminComingSoonList(){const el=document.getElementById("adminComingSoonList");if(!el)return;el.innerHTML="";ND.comingSoonItems.forEach((item,i)=>{const row=document.createElement("div");row.className="admin-url-row";row.innerHTML=`
      <input type="text" class="admin-cs-edit" value="${ndEscape(item.text)}" dir="rtl">
      <button class="admin-url-remove" aria-label="حذف">✕</button>
    `;const editInput=row.querySelector(".admin-cs-edit");let origText=editInput.value;const bar=createAdminSaveBar(row,{isDirty:()=>editInput.value!==origText,onUndo:()=>{editInput.value=origText;},onSave:async()=>{const t=editInput.value.trim();if(!t){editInput.value=origText;return false;}ND.comingSoonItems[i].text=t;await saveComingSoonItems(ND.comingSoonItems);renderComingSoonSheetList();origText=editInput.value;return true;},});editInput.addEventListener("input",bar.refresh);row.querySelector(".admin-url-remove").addEventListener("click",async()=>{if(!window.confirm(`حذف "${item.text}" من عناصر "قريبًا"؟`))return;ND.comingSoonItems.splice(i,1);await saveComingSoonItems(ND.comingSoonItems);renderAdminComingSoonList();renderComingSoonSheetList();});el.appendChild(row);});}function createAdminSaveBar(host,opts){const bar=document.createElement("div");bar.className="admin-saveundo";bar.hidden=true;bar.innerHTML=`<span class="asu-note">✏️ تعديل غير محفوظ</span><span class="asu-btns"><button type="button" class="asu-save">💾 حفظ</button><button type="button" class="asu-undo">↩️ تراجع</button></span>`;host.appendChild(bar);const refresh=()=>{bar.hidden=!opts.isDirty();};bar.querySelector(".asu-undo").addEventListener("click",()=>{opts.onUndo();refresh();});const saveBtn=bar.querySelector(".asu-save");saveBtn.addEventListener("click",async()=>{saveBtn.disabled=true;try{const ok=await opts.onSave();if(ok!==false)showToast("✅ اتحفظ التعديل",1800);}catch(e){showGlobalError("الحفظ",e);}finally{saveBtn.disabled=false;refresh();}});return{refresh};}function adminHasUnsaved(){return!!document.querySelector("#adminPanel .admin-saveundo:not([hidden])");}function adminErrText(err){const msg=String((err&&(err.message||err.details||err.hint))||err||"");if(/permission denied/i.test(msg))return"معرفتش أحفظ — مشكلة إذن في قاعدة البيانات ("+msg+")";if(/not authorized/i.test(msg))return"معرفتش أحفظ — حسابك مالوش صلاحية للخطوة دي، أو جلسة الدخول انتهت (سجّل خروج وادخل تاني)";if(/jwt|expired/i.test(msg))return"معرفتش أحفظ — جلسة الدخول انتهت: سجّل خروج وادخل تاني";if(!navigator.onLine||/failed to fetch|network|load failed/i.test(msg))return"معرفتش أحفظ — مفيش اتصال بالنت";return"معرفتش أحفظ — "+(msg||"خطأ غير معروف");}function wireAdminHeaders(){const addBtn=document.getElementById("contactAddBtn");if(addBtn)addBtn.addEventListener("click",()=>{if(!contactEditorApi)buildContactEditor();contactEditorApi.addRow({emoji:"🔗",label:"",url:"",active:true,places:CONTACT_PLACES.map(p=>p.key)});});const memHeader=document.querySelector('#adminSectionsList .admin-item[data-perm="members"] .app-guide-header');if(memHeader)memHeader.addEventListener("click",()=>{setTimeout(()=>{const item=memHeader.closest(".app-guide-item");if(item&&item.classList.contains("open"))memMarkSeen();},0);});const fbHeader=document.querySelector('#adminSectionsList .admin-item[data-perm="feedback"] .app-guide-header');if(fbHeader)fbHeader.addEventListener("click",()=>{setTimeout(()=>{const item=fbHeader.closest(".app-guide-item");if(item&&item.classList.contains("open")){fbMarkSeen();fbRenderAdminList();}},0);});}let retryReminderBaseTexts=null;function mountAdminPanel(){const oldPanel=document.getElementById("adminPanel");if(oldPanel)oldPanel.remove();const oldStyle=document.getElementById("ndAdminStyle");if(oldStyle)oldStyle.remove();const style=document.createElement("style");style.id="ndAdminStyle";style.textContent=ADMIN_PANEL_CSS;document.head.appendChild(style);const anchor=document.getElementById("adminPassOverlay");if(anchor)anchor.insertAdjacentHTML("beforebegin",ADMIN_PANEL_HTML);else document.body.insertAdjacentHTML("beforeend",ADMIN_PANEL_HTML);const sub=document.querySelector("#adminPanel .chapters-sub");if(sub){const v=document.createElement("p");v.className="admin-js-version";v.textContent="نسخة اللوحة "+ADMIN_JS_VERSION;sub.insertAdjacentElement("afterend",v);}wireAdminHeaders();setupAdminForms();setupDeviceSwitches();setupBankChecksAndWipeList();}const DEV_SWITCH_DAYS=7;let devSwitchLoaded=false;let devSwitchLoading=false;async function renderDeviceSwitches(){const wrap=document.getElementById("devSwitchList");if(!wrap||!supabaseClient||devSwitchLoading)return;devSwitchLoading=true;wrap.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;try{const{data,error}=await withTimeout(supabaseClient.rpc("nd_admin_device_switches",{p_days:DEV_SWITCH_DAYS}),10000,"تبديل الأجهزة");if(error||!Array.isArray(data)){const raw=error?(error.message||JSON.stringify(error)):"لا توجد بيانات";wrap.innerHTML=`<div class="auth-field-help">معرفتش أجيب السجل — (${ndEscape(raw)})</div>`;return;}devSwitchLoaded=true;const acc=new Map();data.forEach(r=>{if(!r||!r.user_id)return;let a=acc.get(r.user_id);if(!a){a={r:r,rows:[],switches:0,devices:new Set(),last:null};acc.set(r.user_id,a);}a.rows.push(r);a.devices.add(r.device_no);if(!r.is_first){a.switches++;if(!a.last||String(r.at)>String(a.last))a.last=r.at;}});const list=Array.from(acc.values()).sort((x,y)=>(y.switches-x.switches)||(y.devices.size-x.devices.size)||String(y.last||y.rows[0].at).localeCompare(String(x.last||x.rows[0].at)));if(!list.length){wrap.innerHTML=`<div class="auth-field-help">مفيش أي تبديل في آخر ${DEV_SWITCH_DAYS} أيام.</div>`;return;}wrap.innerHTML="";list.forEach(a=>{const who=a.r.display_name||a.r.email||"—";const box=document.createElement("div");box.className="dev-acc";box.innerHTML=`
        <button type="button" class="dev-acc-head" aria-expanded="false">
          <span class="dev-acc-who">${ndEscape(who)} <bdi class="member-no-tag">${ndEscape(a.r.member_no||"")}</bdi></span>
          <span class="dev-acc-count">🔁 ${a.switches} تبديل</span>
        </button>
        <div class="dev-acc-sub">📱 ${a.devices.size} ${a.devices.size===1?"جهاز":"أجهزة"}${a.last?` · آخر تبديل <bdi dir="ltr">${ndEscape(fmtActTime(a.last))}</bdi>`:""}${a.r.email&&a.r.display_name?` · <bdi dir="ltr">${ndEscape(a.r.email)}</bdi>`:""}</div>
        <div class="dev-acc-rows"></div>`;const rowsWrap=box.querySelector(".dev-acc-rows");a.rows.forEach(r=>{const row=document.createElement("div");row.className="dev-row";const kind=r.is_first?`<span class="mer-badge dev-known">أول جهاز</span>`:(r.is_new?`<span class="mer-badge mer-new">🆕 جهاز جديد</span>`:`<span class="mer-badge dev-known">جهاز معروف</span>`);row.innerHTML=`<span class="dev-row-time">${ndEscape(fmtActTime(r.at))}</span>
          <span class="dev-row-label">${ndEscape("جهاز "+(r.device_no||"?")+(r.label?" — "+r.label:""))}</span>${kind}`;rowsWrap.appendChild(row);});const head=box.querySelector(".dev-acc-head");head.addEventListener("click",()=>{const open=box.classList.toggle("open");head.setAttribute("aria-expanded",open?"true":"false");});wrap.appendChild(box);});}catch(e){wrap.innerHTML=`<div class="auth-field-help">معرفتش أجيب السجل — اتأكد من النت وجرّب تاني.</div>`;}finally{devSwitchLoading=false;}}let bankChecksLoading=false,bankChecksLoaded=false;const ND_TIER_LABEL={full:"مفعّل",trial:"غير مفعّل"};async function renderBankChecks(){const wrap=document.getElementById("bankChecksList");if(!wrap||bankChecksLoading)return;bankChecksLoading=true;wrap.innerHTML=`<div class="auth-field-help">بيتحمّل...</div>`;try{const{data,error}=await supabaseClient.rpc("admin_bank_checks",{p_limit:30});if(error){console.warn("[admin] bank checks",error.code||error.message);wrap.innerHTML=`<div class="auth-field-help">معرفتش أجيب القايمة — لازم صلاحية الأعضاء.</div>`;return;}bankChecksLoaded=true;if(!Array.isArray(data)||!data.length){wrap.innerHTML=`<div class="auth-field-help">مفيش أي جهاز فضل فيه اختلاف.</div>`;return;}wrap.innerHTML=data.map(r=>`<div class="dev-row bank-check-row">
        <span class="dev-row-label">${ndEscape(r.member_label||"—")}${r.device_label?" — "+ndEscape(r.device_label):""}</span>
        <span class="dev-row-time">${ndEscape(fmtActTime(r.at))}</span>
        <span>${ndEscape(ND_TIER_LABEL[r.tier]||r.tier||"")} · إصدار <bdi dir="ltr">${ndEscape(r.app_version||"?")}</bdi> · على الجهاز ${Number(r.local_n)||0} وعلى السيرفر ${Number(r.server_n)||0}</span>
      </div>`).join("");}catch(e){console.warn("[admin] bank checks",e&&e.message);wrap.innerHTML=`<div class="auth-field-help">معرفتش أجيب القايمة — اتأكد من النت وجرّب تاني.</div>`;}finally{bankChecksLoading=false;}}function setupBankChecksAndWipeList(){const item=document.getElementById("adminBankChecksItem");const header=item&&item.querySelector(".app-guide-header");if(header)header.addEventListener("click",()=>{setTimeout(()=>{if(item.classList.contains("open")&&!bankChecksLoaded)renderBankChecks();},0);});const btn=document.getElementById("bankChecksRefresh");if(btn)btn.addEventListener("click",()=>renderBankChecks());const memItem=document.querySelector('#adminSectionsList .admin-item[data-perm="members"]');const memHeader=memItem&&memItem.querySelector(".app-guide-header");if(memHeader)memHeader.addEventListener("click",()=>{setTimeout(()=>{if(memItem.classList.contains("open"))ndWipeLoadAll();},0);});const wb=document.getElementById("adminWipeAllRefresh");if(wb)wb.addEventListener("click",()=>ndWipeLoadAll());}function setupDeviceSwitches(){const item=document.getElementById("adminDevicesItem");if(!item)return;const header=item.querySelector(".app-guide-header");if(header)header.addEventListener("click",()=>{setTimeout(()=>{if(item.classList.contains("open")&&!devSwitchLoaded)renderDeviceSwitches();},0);});const btn=document.getElementById("devSwitchRefresh");if(btn)btn.addEventListener("click",()=>renderDeviceSwitches());}mountAdminPanel();ND.registerAdmin({version:ADMIN_JS_VERSION,renderAdminPanel:()=>{renderAdminPanel();if(retryReminderBaseTexts)retryReminderBaseTexts();},hasUnsaved:adminHasUnsaved,onBadges:(c)=>{setSectionBadge("members",c.mem.nw);setSectionBadge("feedback",c.sug.nw+c.prob.nw);},});})(window.ND_ADMIN_API);
/*! ND-ADMIN-JS-END */