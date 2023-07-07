package board.file.mappers;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import board.file.dto.board.BoardListDTO;

@Mapper
public interface FileMapper {

    // Create Image
    int createImage(List<Map<String, String>> imageList);

    // Delete Image
    int deleteImage(Long tno);

    // Update Image
    int updateImage(List<Map<String, String>> imageList);

}
