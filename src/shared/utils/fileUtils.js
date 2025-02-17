import { supabase } from "../../supabase/client";

//파일 선택 호출 함수
export const handleImageChange = (e, setImage) => {
  const file = e.target.files[0];

  if (file) {
    // 파일 확장자 검사
    const validExtensions = ['image/jpeg', 'image/png']; // 허용되는 이미지 형식
    if (!validExtensions.includes(file.type)) {
      alert('이미지 파일은 jpg, jpeg, png만 가능합니다.');
      return;
    }

    // 파일 용량 검사 (5MB 이하)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('이미지 파일 용량은 5MB 이하로 업로드 해주세요.');
      return;
    }

    // 유효성 검사 통과 후 파일 설정
    setImage(file);
  }
};

//파일 업로드 함수
export const handleImageUpload = async (image, profile) => {

  // 파일 저장 경로 (중복 방지를 위해 timestamp 추가)
  const filePath = `public/${Date.now()}_${image.name}`;

  // 1.storage에 이미지 업로드
  const { data, error } = await supabase
    .storage
    .from("profile-image")
    .upload(filePath, image);

  if (error) {
    console.error("업로드실패", error.message);
  } else {
    console.log("업로드성공", data);
  }

  // 2.storage에 업로드된 이미지 URL 가져오기
  const { data: publicUrlData, error: publicError } = supabase
    .storage
    .from("profile-image")
    .getPublicUrl(filePath);
  if(publicError){
    console.log("이미지가져오기 실패", publicError)
  }
  const imageUrl = publicUrlData.publicUrl;

  // 3.table에 URL 저장
  const { error: updateError } = await supabase
    .from("users")
    .update({ my_profile_image_url: imageUrl })
    .eq("id", profile.id);

  if (updateError) {
    console.error("URL 업데이트 실패", updateError.message);
    throw new Error(updateError.message);  // URL 업데이트 에러 처리
  }

  return imageUrl;  // imageUrl을 반환
};